const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const TelegramBot = require('node-telegram-bot-api');
const azure = require('azure-storage');

// replace the value below with the Telegram token you receive from @BotFather
const token = '788876891:AAGJPvBNsE2EIFGaMUOUA82FV_M0ugoizXU';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

const state = {};

// Azure Queue Service
const queueSvc = azure.createQueueService();
queueSvc.createQueueIfNotExists('disrupt', function (error, results, response) {
    if (!error) {
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
    console.log(JSON.stringify(msg));
    console.log(JSON.stringify(state));
    if (state[msg.chat.id].state == "Start") {
        if (text.indexOf("สร้าง Blob Week") === 0) {
            state[msg.chat.id].state = "Blob";
            bot.sendMessage(msg.chat.id, "เลือกสี", {
                "reply_markup": {
                    "keyboard": [["Indigo"], ["Green"]]
                }
            });
        } else if (text.indexOf("ลบงาน") === 0) {
            
        }
    } else if (state[msg.chat.id].state == "Blob") {
        var queueMsg = {
            Command: "Blob",
            ListenerName: text
        };
        queueSvc.createMessage('disrupt', JSON.stringify(queueMsg), function (error, results, response) {
            if (!error) {
                // Message inserted
            }
        });
        state[msg.chat.id].state = "Finish"
    }
});

bot.onText(/\/command/, (msg) => {
    if (!state[msg.chat.id]) {
        console.log("No state for " + msg.chat.id);
        state[msg.chat.id] = {
            id: msg.chat.id
        };
    }
    state[msg.chat.id].state = "Start";
    console.log(JSON.stringify(state));
    bot.sendMessage(msg.chat.id, "เลือกคำสั่ง", {
        "reply_markup": {
            "keyboard": [["ลบงาน"], ["สร้าง Blob Week"]]
        }
    });
});