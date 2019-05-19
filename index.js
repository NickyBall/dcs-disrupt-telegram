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

var state = {};

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

bot.onText(/\/command/, (msg) => {
    const chatId = msg.chat.id;
    if (!state[chatId]) {
        console.log("No state for " + chatId);
        state[chatId] = {
            id: chatId
        };
    }
    state[chatId].state = "Start";
    console.log(JSON.stringify(state));
    bot.sendMessage(chatId, "เลือกคำสั่ง", {
        "reply_markup": {
            "keyboard": [["ลบงาน"], ["สร้าง Blob Week"]]
        }
    });
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    var text = msg.text;
    if (state[chatId]) {
        console.log(JSON.stringify(state));
        if (state[chatId].state == "Start") {

            if (text.indexOf("สร้าง Blob Week") === 0) {
                state[chatId].state = "Blob";
            } else if (text.indexOf("ลบงาน") === 0) {
                state[chatId].state = "Task";
                // bot.sendMessage(chatId, "กรุณาระบุ TaskIdentityKeyTime");
            }
            if (state[chatId].state == "Blob" || state[chatId].state == "Task") {
                if (state[chatId].listenerName) {
                    state[chatId].listenerName = undefined;
                }
                bot.sendMessage(chatId, "เลือกสี", {
                    "reply_markup": {
                        "keyboard": [["Indigo"], ["Grey"], ["Green"]]
                    }
                });
            }
            
        } else if (state[chatId].state == "Blob" || state[chatId].state == "Task") {

            if (!state[chatId].listenerName) {
                state[chatId].listenerName = text;
                if (state[chatId].state == "Blob") {
                    bot.sendMessage(chatId, "กรุณาระบุ วันที่เริ่มต้นสัปดาห์ ในรูปแบบ dd/mm/yyyy (หากไม่ระบุ จะใช้สัปดาห์ปัจจุบัน)");
                } else if (state[chatId].state == "Task") {
                    bot.sendMessage(chatId, "กรุณาระบุ TaskIdentityKeyTime");
                }
            } else {
                var queueMsg = {
                    Command: state[chatId].state,
                    ListenerName: state[chatId].listenerName,
                    Message: text
                };
                queueSvc.createMessage('disrupt', JSON.stringify(queueMsg), function (error, results, response) {
                    if (!error) {
                        // Message inserted
                    }
                });
                state[chatId].state = "Finish"
                bot.sendMessage(chatId, "เสร็จเรียบร้อยแล้ว");
            }

        }
    }
});