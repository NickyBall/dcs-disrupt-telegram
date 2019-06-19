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
const blobcommand = [
    ["สร้างสัปดาห์ล่าสุด"],["ระบุ WeekKeyTime"]];

const removeKeyBoard = JSON.stringify({
    remove_keyboard: true
})
// Azure Queue Service
const queueSvc = azure.createQueueService();
queueSvc.createQueueIfNotExists('disrupt', function (error, results, response) {
    if (!error) {
        // Queue created or exists
    }
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

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
        console.log("state is exist")
        if (state[chatId].state === "Start") {
            if (text.indexOf("ลบงาน") === 0) {
                state[chatId].state = "DeletingWork";
                bot.sendMessage(chatId, 'กรณีระบุ TaskIdentityKeyTime');
            } else if (text.indexOf("สร้าง Blob Week") === 0) {
                state[chatId].state = "CreatingBlobWeek";
                bot.sendMessage(chatId, "เลือกคำสั่ง", {
                    "reply_markup": {
                        "keyboard": blobcommand
                    }
                });

            } else if (text.indexOf("แสดงรายชื่อคนที่ไม่ได้ยืนยันเครื่อง") === 0) {
                disrupt.getInvalidateComputer(capitalizeFirstLetter(state[chatId].whiteLabel)).then(res => {
                    res.contract.userInvalidateComputerContract.map(c => bot.sendMessage(chatId, `${c.username}, ${c.computerName} => ${c.securityCode}\n`
                    , {"reply_markup": removeKeyBoard}));
                    state[chatId].state = "Finish";
                }).catch(err => console.log(err));
            } else if (text.indexOf("ติดตั้ง Cert") === 0) {
                state[chatId].state = "InstallCert";
                bot.sendMessage(chatId, 'กรณีระบุ Install Code (eg. aBcd)',{"reply_markup": removeKeyBoard});
            }
        }
        else if (state[chatId].state === "CreatingBlobWeek") {
            console.log("CreatingBlobWeek");
            if (text.indexOf("สร้างสัปดาห์ล่าสุด") === 0) {
                bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
                disrupt.createBlobByWeekKeyTime(capitalizeFirstLetter(state[chatId].whiteLabel), "").then(res => {
                    if(res['resultCode'] == 200) bot.sendMessage(chatId, 'สร้างเสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
                    else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
                }).catch(err => console.log(err));
                state[chatId].state = "Finish";
            }
            else if (text.indexOf("กรุณาระบุ WeekKeyTime(eg. 3091260600000000)") === 0){
                bot.sendMessage(chatId, "ระบุ WeekKeyTime", {"reply_markup": removeKeyBoard});
                state[chatId].state = "CreateingBlobWeekKeyTime";
            }
        }
        else if(state[chatId].state === "CreateingBlobWeekKeyTime"){
            console.log("CreateingBlobWeekKeyTime");
            console.log(text);
            bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
            disrupt.createBlobByWeekKeyTime(capitalizeFirstLetter(state[chatId].whiteLabel), text).then(res => {
                if(res['resultCode'] == 200) bot.sendMessage(chatId, 'สร้างเสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
                else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
            }).catch(err => console.log(err));
            state[chatId].state = "Finish";
        }
        else if (state[chatId].state === "DeletingWork") {
            bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
            disrupt.deleteWorkByTaskIdentityKeyTime(capitalizeFirstLetter(state[chatId].whiteLabel), text).then(res => {
                if(res['resultCode'] == 200) bot.sendMessage(chatId, 'ลบงานเสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
                else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
            }).catch(err => console.log(err));
            state[chatId].state = "Finish";
        }
        else if (state[chatId].state === "InstallCert") {
            bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
            disrupt.installCert(capitalizeFirstLetter(state[chatId].whiteLabel), text).then(res => {
                if(res['resultCode'] == 200) bot.sendMessage(chatId, 'ติดตั้งเสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
                else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
            }).catch(err => console.log(err));
            state[chatId].state = "Finish";
        }
    }
});