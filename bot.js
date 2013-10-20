var io = require('socket.io-client');
var config = require('./config');
var socket = io.connect('http://server.whiskchat.com');
var hooks = require('./hooks');
var chatBuffer = [];
var shutdown = false;
function chat(room, msg, color) {
    chatBuffer.push({
        room: room,
        message: "[color=#" + color + "]" + msg + "[/color]",
        color: color
    });
}

function pm(user, msg, color) {
    chatBuffer.push({
        room: 'WhiskDiceBot:' + user.toLowerCase(),
        message: msg,
        color: color
    });
}

function tip(obj) {
    chatBuffer.push({
        tipobj: obj
    });
}
setInterval(function() {
    if (chatBuffer[0]) {	
        if (chatBuffer[0].tipobj) {
            console.log('[WhiskChat] [Bot API] Tipping: ' + JSON.stringify(chatBuffer[0].tipobj));
            socket.emit("tip", chatBuffer[0].tipobj);
        } else {
            console.log('[WhiskChat] [Bot API] Chatting: ' + chatBuffer[0].message);
            socket.emit("chat", chatBuffer[0]);
        }
        chatBuffer.splice(0, 1);
    } else {
        if (shutdown) {
            console.log('[WDB] Shutting down...');
            process.exit(0);
        }
    }
}, 600);
console.log('[WhiskChat] [Bot API] Connecting...');
hooks.chat = chat;
hooks.tip = tip;
hooks.log = function(message) {
    console.log('[WhiskChat] [' + hooks.id + '] ' + message);
};
function stripHTML(html) {
    return html.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>?/gi, '');
}
hooks.username = 'Not logged in';
hooks.s = socket;
socket.on('connect', function() {
    console.log('[WhiskChat] [Bot API] Connected! Logging in..');
    socket.emit('accounts', {action: 'login', username: config.username, password: config.password});
    socket.on('loggedin', function(data) {
        console.log('[WhiskChat] [Bot API] Logged in!');
	socket.emit('chat', {room: 'main', message: '!; connect ' + config.username + '/' + config.owner});
	setTimeout(function() {
	    hooks.username = data.username;
            chat(hooks.room, '[b]:) ' + hooks.id + ' initialized! (using [link=http://whiskers75.com/botapi]WhiskChat Bot API[/link])[/b]', '77216F');
            console.log('[WhiskChat] [Bot API] Initialized!');
	}, 2000);
    });
    socket.on('message', function(msg) {
	console.log('[WhiskChat] [Server] ' + stripHTML(msg.message));
    });
    socket.on('chat', hooks.ChatHandler);
    socket.on('tip', function(tip) {
	if (tip.target == hooks.username) {
	    hooks.TipHandler(tip);
	}
    });
});
