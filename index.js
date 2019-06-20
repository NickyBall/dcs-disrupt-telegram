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
const token = process.env.BOT_API_KEY;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

var state = {};
const whiteLabels = ["indigo", "grey", "green"];
const firstPageCommands = [
    ["จัดการทั่วไป"],
    ["จัดการงาน"],
    ["จัดการคิว"],
    ["จัดการความปลอดภัย"]
];
const generalCommands = [
    ["เติมเครดิต"],
    ["สร้าง Blob Week"],
    ["สร้าง Blob Partition"]
];
const workCommands = [
    ["ลบงานโดย TaskIdentityKeyTime"],
    ["ลบงานโดย IdentityKeyTime"],
    ["สำเร็จงานโดย IdentityKeyTime"]
];
const queueCommands = [
    ["ต้องการทราบจำนวนคิว"],
    ["เริ่มคิว"],
    ["เคลียร์คิว"],
    ["คิวสเตท"],
    ["คิวสเตททั้งหมด"],    
];
const securityCommands = [
    ["แสดงรายชื่อคนที่ไม่ได้ยืนยันเครื่อง"],
    ["ติดตั้ง Cert"]
];
const blobweekcommand = [
    ["สร้างสัปดาห์ล่าสุด"],["ระบุ WeekKeyTime"]];

const department = [
    ["Operator"],
    ["Banker"],
    ["Updater"]
];
const removeKeyBoard = JSON.stringify({
    remove_keyboard: true
});

const resizeKeyBoard = JSON.stringify({
    resize_keyboard: true
});
const forceReplyKeyBoard = JSON.stringify({
    force_reply: true
});

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
                "keyboard": firstPageCommands,
                resizeKeyBoard
            }
        });
    }
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    var text = msg.text;
    console.log(JSON.stringify(state));
    console.log(text);

    if (state[chatId]) {
        //console.log(state[chatId].state);

        //#region First Page Command
        if (state[chatId].state === "Start") {
            if (text.indexOf("จัดการทั่วไป") === 0) {
                state[chatId].state = "GeneralManagement";
                bot.sendMessage(chatId, "เลือกคำสั่ง", {"reply_markup": {"keyboard": generalCommands, "resize_keyboard" : true}});
            }
            else if (text.indexOf("จัดการงาน") === 0) {
                state[chatId].state = "WorkManagement";
                bot.sendMessage(chatId, "เลือกคำสั่ง", {"reply_markup": {"keyboard": workCommands, "resize_keyboard" : true}});
            }
            else if (text.indexOf("จัดการคิว") === 0) {
                state[chatId].state = "QueueManagement";
                bot.sendMessage(chatId, "เลือกคำสั่ง", {"reply_markup": {"keyboard": queueCommands, "resize_keyboard" : true}});
            }
            else if (text.indexOf("จัดการความปลอดภัย") === 0) {
                state[chatId].state = "SecurityManagement";
                bot.sendMessage(chatId, "เลือกคำสั่ง", {"reply_markup": {"keyboard": securityCommands, "resize_keyboard" : true}});
            }
        }
        //#endregion

        //#region General Management Command
        else if (state[chatId].state === "GeneralManagement"){
            if(text.indexOf("เติมเครดิต") === 0){
                state[chatId].state = "TopupCredit";
                bot.sendMessage(chatId, "กรอกจำนวนเครดิตที่ต้องการเติม", {"reply_markup": {"force_reply" : true, "resize_keyboard" : true}});
            }
            if(text.indexOf("สร้าง Blob Week") === 0){
                state[chatId].state = "BlobWeek";
                bot.sendMessage(chatId, "เลือกคำสั่งการจัดการ Blob", {"reply_markup": {"keyboard": blobweekcommand, "resize_keyboard" : true}});
            }
            if(text.indexOf("สร้าง Blob Partition") === 0){
                state[chatId].state = "BlobPartition";
                bot.sendMessage(chatId, "เลือกแผนก Department", {"reply_markup": {"keyboard": department, "resize_keyboard" : true}});
            }
        }
        //#region Topup Credit
        else if (state[chatId].state === "TopupCredit"){
            bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
            disrupt.topupCredit(capitalizeFirstLetter(state[chatId].whiteLabel), text).then(res => {
                if(res['resultCode'] == 200) bot.sendMessage(chatId, 'เติมเครดิตเสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
                else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
            }).catch(err => console.log(err));
            state[chatId].state = "Finish";
        }
        //#endregion

        //#region BlobWeek
        else if (state[chatId].state === "BlobWeek"){
            if(text.indexOf("สร้างสัปดาห์ล่าสุด") === 0){
                bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
                disrupt.createBlobByWeekKeyTime(capitalizeFirstLetter(state[chatId].whiteLabel), "").then(res => {
                    if(res['resultCode'] == 200) bot.sendMessage(chatId, 'สร้าง Blob เสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
                    else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
                }).catch(err => console.log(err));
                state[chatId].state = "Finish";
            }
            else if(text.indexOf("ระบุ WeekKeyTime") === 0){
                state[chatId].state = "WeekKeyTimeBlob";
                bot.sendMessage(chatId, "กรุณาระบุ WeekKeyTime(eg.3091260600000000)", {"reply_markup": {"force_reply" : true}});
            }
        }
        else if(state[chatId].state === "WeekKeyTimeBlob"){
            bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
            disrupt.createBlobByWeekKeyTime(capitalizeFirstLetter(state[chatId].whiteLabel), text).then(res => {
                if(res['resultCode'] == 200) bot.sendMessage(chatId, 'สร้าง Blob เสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
                else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
            }).catch(err => console.log(err));
            state[chatId].state = "Finish";
        }
        //#endregion

        //#region  Blob Partition
        else if (state[chatId].state === "BlobPartition"){
            state[chatId].state = "WeekKeyTime"
            if(text.indexOf("Operator") === 0) state[chatId].Department = "operator"
            else if(text.indexOf("Banker") === 0) state[chatId].Department = "banker"
            else if(text.indexOf("Updater") === 0) state[chatId].Department = "updater"
            bot.sendMessage(chatId, "กรุณาระบุ WeekKeyTime(eg.3091260600000000)", {"reply_markup": {"force_reply" : true}});
        }
        else if (state[chatId].state === "WeekKeyTime"){
            state[chatId].state = "PartitionNumber";
            state[chatId].WeekKeyTime = text;
            bot.sendMessage(chatId, "กรุณาระบุ Partition(eg.9999999999)", {"reply_markup": {"force_reply" : true}});
        }
        else if (state[chatId].state === "PartitionNumber"){
            state[chatId].state = "AccountPattern";
            state[chatId].Partition = text;
            bot.sendMessage(chatId, "กรุณาระบุ AccountPatter(Thai = 1, Inter = 2)", {"reply_markup": {"force_reply" : true}});
        }
        else if (state[chatId].state === "AccountPattern"){
            state[chatId].state = "Finish";
            state[chatId].AccountPattern = text;
            console.log("end =>" + JSON.stringify(state));
            console.log("end =>" + text);
        }
        //#endregion
        //#endregion

        // WorkTask Management Command
        // Queue Management Command
        // Security ManageMent Command
    }
});
        // else if (state[chatId].state === "CreatingBlobWeek") {
        //     if (text.indexOf("สร้างสัปดาห์ล่าสุด") === 0) {
        //         bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
        //         disrupt.createBlobByWeekKeyTime(capitalizeFirstLetter(state[chatId].whiteLabel), "").then(res => {
        //             if(res['resultCode'] == 200) bot.sendMessage(chatId, 'สร้างเสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
        //             else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
        //         }).catch(err => console.log(err));
        //         state[chatId].state = "Finish";
        //     }
        //     else if (text.indexOf("ระบุ WeekKeyTime") === 0){
        //         state[chatId].state = "WeekKeyTimeBlob";
        //         bot.sendMessage(chatId, "กรุณาระบุ WeekKeyTime(eg.3091260600000000)", {"reply_markup": {"force_reply" : true}});
        //     }
        // }
        // else if(state[chatId].state === "WeekKeyTimeBlob"){
        //     console.log("WeekKeyTimeBlob");
        //     console.log(text);
        //     // if(text != "กรุณาระบุ WeekKeyTime(eg.3091260600000000)") {
        //     // console.log("Execute WeekKeyTimeBlob");
        //     // bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
        //     // disrupt.createBlobByWeekKeyTime(capitalizeFirstLetter(state[chatId].whiteLabel), text).then(res => {
        //     //     if(res['resultCode'] == 200) bot.sendMessage(chatId, 'สร้างเสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
        //     //     else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
        //     // }).catch(err => console.log(err));
        //     // state[chatId].state = "Finish";
        //     // }
        // }
        // else if (state[chatId].state === "DeletingWork") {
        //     bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
        //     disrupt.deleteWorkByTaskIdentityKeyTime(capitalizeFirstLetter(state[chatId].whiteLabel), text).then(res => {
        //         if(res['resultCode'] == 200) bot.sendMessage(chatId, 'ลบงานเสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
        //         else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
        //     }).catch(err => console.log(err));
        //     state[chatId].state = "Finish";
        // }
        // else if (state[chatId].state === "InstallCert") {
        //     bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
        //     disrupt.installCert(capitalizeFirstLetter(state[chatId].whiteLabel), text).then(res => {
        //         if(res['resultCode'] == 200) bot.sendMessage(chatId, 'ติดตั้งเสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
        //         else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
        //     }).catch(err => console.log(err));
        //     state[chatId].state = "Finish";
        // }

        // if (text.indexOf("ลบงาน") === 0) {
        //     state[chatId].state = "DeletingWork";
        //     bot.sendMessage(chatId, 'กรณีระบุ TaskIdentityKeyTime');
        // } else if (text.indexOf("สร้าง Blob Week") === 0) {
        //     state[chatId].state = "CreatingBlobWeek";
        //     bot.sendMessage(chatId, "เลือกคำสั่ง", {
        //         "reply_markup": {"keyboard": blobcommand}
        //     });

        // } else if (text.indexOf("แสดงรายชื่อคนที่ไม่ได้ยืนยันเครื่อง") === 0) {
        //     bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
        //     disrupt.getInvalidateComputer(capitalizeFirstLetter(state[chatId].whiteLabel)).then(res => {
        //         res.contract.userInvalidateComputerContract.map(c => bot.sendMessage(chatId, `${c.username}, ${c.computerName} => ${c.securityCode}\n`
        //         , {"reply_markup": removeKeyBoard}));
        //         state[chatId].state = "Finish";
        //     }).catch(err => console.log(err));
        // } else if (text.indexOf("ติดตั้ง Cert") === 0) {
        //     state[chatId].state = "InstallCert";
        //     bot.sendMessage(chatId, 'กรณีระบุ Install Code (eg. aBcd)',{"reply_markup": removeKeyBoard});
        // }
