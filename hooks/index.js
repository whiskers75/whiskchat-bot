/**
   WhiskChat Bot API example logic
   To aid in easy bot creation
   Feel free to customize!
**/
var WhiskChatLogic = {
    id: 'StarterLogic', // The name of your bot's logic/code - like DiceLogic or FishingLogic
    creator: 'YourNameHere', // Your name
    room: 'main' // The room in which to run your bot
};
/**
   function ChatHandler([chat object])
   Called whenever someone speaks.
**/
WhiskChatLogic.ChatHandler = function(chat) {
    if (chat.message == '!test') {
	WhiskChatLogic.chat('main', 'Got the test command!', '000');
    }
};
/**
   Function TipHandler([tip object])
   Called whenever a tip is made to your bot.
**/
WhiskChatLogic.TipHandler = function(tip) {
    WhiskChatLogic.chat(tip.room, 'Thank you, ' + tip.user + ', for your tip! I\'ll give you half back, since I\'m not greedy. :)', '090');
    WhiskChatLogic.tip({tip: tip.amount / 2, user: tip.user, room: tip.room});
    WhiskChatLogic.log('Somebody tipped me! :)');
};
module.exports = WhiskChatLogic;
