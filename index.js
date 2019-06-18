const express = require('express');
const disrupt = require('./disruptapi');
var https = require("https");
// https.globalAgent.options.ca = require('ssl-root-cas/latest').create();
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
const whiteLabels = ["indigo", "grey", "green"];
const commands = [
    ["ลบงาน"],
    ["สร้าง Blob Week"],
    ["แสดงรายชื่อคนที่ไม่ได้ยืนยันเครื่อง"],
    ["ติดตั้ง Cert"]
];

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

bot.onText(/\/\w+/, (msg) => {
    const chatId = msg.chat.id;
    var text = msg.text;
    console.log(JSON.stringify(text));

    var whiteLabel = text.toLowerCase().substring(1);

    if (!state[chatId]) {
        console.log("No state for " + chatId);
        state[chatId] = {
            id: chatId
        };
    }

    if (!whiteLabels.includes(whiteLabel)) {
        bot.sendMessage(chatId, "ไม่มีสีนี้ในระบบ");
    } else {

        state[chatId].state = "Start";
        state[chatId].whiteLabel = whiteLabel;

        console.log(JSON.stringify(state));
        bot.sendMessage(chatId, "เลือกคำสั่ง", {
            "reply_markup": {
                "keyboard": commands
            }
        });
    }
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
            } else if (text.indexOf("ลบงาน") === 0) {
            } else if (text.indexOf("แสดงรายชื่อคนที่ไม่ได้ยืนยันเครื่อง") === 0) {
                console.log(`whiteLabel => ${state[chatId].whiteLabel}`);
                disrupt.getInvalidateComputer(state[chatId].whiteLabel).then(res => {
                    var message = '';
                    console.log(`message length => ${res.contract.userInvalidateComputerContract.length}`);
                    for (var i = 0; i < res.contract.userInvalidateComputerContract.length; i++) {
                        var c = res.contract.userInvalidateComputerContract[i];
                        message = message + `${c.username}, ${c.computerName} => ${c.securityCode}\n`;
                    }
                    // res.contract.userInvalidateComputerContract.map(c => message = message + `${c.username}, ${c.computerName} => ${c.securityCode}\n`);
                    console.log(`message => ${message}`);
                    bot.sendMessage(chatId, message);
                }).catch(err => console.log(err));
            } else if (text.indexOf("ติดตั้ง Cert") === 0) {
            }
        }
    }
});