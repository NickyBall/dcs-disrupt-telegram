const TelegramBot = require('node-telegram-bot-api');
const azure = require('azure-storage');

// replace the value below with the Telegram token you receive from @BotFather
const token = '788876891:AAGJPvBNsE2EIFGaMUOUA82FV_M0ugoizXU';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Azure Queue Service
const queueSvc = azure.createQueueService();
queueSvc.createQueueIfNotExists('disrupt', function(error, results, response){
    if(!error){
        // Queue created or exists
    }
});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  var text = msg.text;

  if (text.indexOf("สร้าง Blob Week") === 0) {
    queueSvc.createMessage('disrupt', "Create Blob Week", function(error, results, response){
        if(!error){
          // Message inserted
        }
      });
  } else if (text.indexOf("ลบงาน") === 0) {
    queueSvc.createMessage('disrupt', "Remove Task", function(error, results, response){
        if(!error){
          // Message inserted
        }
      });
  }
  
  console.log(JSON.stringify(msg));
  

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
});

bot.onText(/\/command/, (msg) => {
    
    bot.sendMessage(msg.chat.id, "เลือกคำสั่ง", {
    "reply_markup": {
        "keyboard": [["ลบงาน"], ["สร้าง Blob Week"]]
        }
    });
    
});