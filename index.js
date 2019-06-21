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
    ["ต้องการทราบจำนวนคิวที่กำหนด"],
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
            else if(text.indexOf("สร้าง Blob Week") === 0){
                state[chatId].state = "BlobWeek";
                bot.sendMessage(chatId, "เลือกคำสั่งการจัดการ Blob", {"reply_markup": {"keyboard": blobweekcommand, "resize_keyboard" : true}});
            }
            else if(text.indexOf("สร้าง Blob Partition") === 0){
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
            bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
            disrupt.createBlobByPartition(state[chatId].Department, capitalizeFirstLetter(state[chatId].whiteLabel), state[chatId].WeekKeyTime
            ,state[chatId].Partition, text).then(res => {
                if(res['resultCode'] == 200) bot.sendMessage(chatId, 'สร้าง Blob Partition เสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
                else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
            }).catch(err => console.log(err));
            state[chatId].state = "Finish";
        }
        //#endregion
        //#endregion

        //#region  WorkTask Management Command
        else if (state[chatId].state === "WorkManagement"){
            if(text.indexOf("ลบงานโดย TaskIdentityKeyTime") === 0){
                state[chatId].state = "TaskIdentDelete";
                bot.sendMessage(chatId, "กรุณาระบุ TaskIdentityKeyTime(eg.3091112131567160_OAOUY)", {"reply_markup": {"force_reply" : true}});
            }
            else if(text.indexOf("ลบงานโดย IdentityKeyTime") === 0){
                state[chatId].state = "IdentDelete";
                bot.sendMessage(chatId, "เลือกแผนก Department", {"reply_markup": {"keyboard": department, "resize_keyboard" : true}});
            }
            else if(text.indexOf("สำเร็จงานโดย IdentityKeyTime") === 0){
                state[chatId].state = "CompleteIdent";
                bot.sendMessage(chatId, "เลือกแผนก Department", {"reply_markup": {"keyboard": department, "resize_keyboard" : true}});
            }
        }

        //#region Delete by TaskIdentityKeyTime
        else if(state[chatId].state === "TaskIdentDelete"){
            bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
            disrupt.deleteWorkByTaskIdentityKeyTime(capitalizeFirstLetter(state[chatId].whiteLabel), text).then(res => {
                if(res['resultCode'] == 200) bot.sendMessage(chatId, 'ลบงานเสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
                else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
            }).catch(err => console.log(err));
            state[chatId].state = "Finish";
        }
        //#endregion

        //#region  DeleteSpecific by IdentityKeyTime
        else if (state[chatId].state === "IdentDelete"){
            state[chatId].state = "TaskIdentityDelete";
            if(text.indexOf("Operator") === 0){
                state[chatId].Department = "operator";
                bot.sendMessage(chatId, "กรุณาระบุ IdentityKeyTime(eg.3091123883325470_5SEI8)", {"reply_markup": {"force_reply" : true}});

            }
            else if(text.indexOf("Banker") === 0) {
                state[chatId].Department = "banker";
                bot.sendMessage(chatId, "กรุณาระบุ TaskIdentityKeyTime(eg.3091123883325470_5SEI8)", {"reply_markup": {"force_reply" : true}});

            }
            else if(text.indexOf("Updater") === 0) {
                state[chatId].Department = "updater";
                bot.sendMessage(chatId, "กรุณาระบุ TaskIdentityKeyTime(eg.3091123883325470_5SEI8)", {"reply_markup": {"force_reply" : true}});
            }
        }
        else if (state[chatId].state === "TaskIdentityDelete"){
            if(state[chatId].Department === "operator"){
                bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
                console.log(text);
                disrupt.deleteSpecificWork(capitalizeFirstLetter(state[chatId].whiteLabel), (state[chatId].Department).toLowerCase()
                , "", text).then(res => {
                    if(res['resultCode'] == 200) bot.sendMessage(chatId, 'ลบงานเสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
                    else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
                }).catch(err => console.log(err));
                state[chatId].state = "Finish";
            }
            else if((state[chatId].Department === "banker") || state[chatId].Department === "updater"){
                state[chatId].state = "NotOperator";
                state[chatId].TaskIdentityKeyTime = text;
                bot.sendMessage(chatId, "กรุณาระบุ IdentityKeyTime(eg.3091123883325470_5SEI8)", {"reply_markup": {"force_reply" : true}});
            }
        }
        else if (state[chatId].state === "NotOperator"){
            bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
            disrupt.deleteSpecificWork(capitalizeFirstLetter(state[chatId].whiteLabel),(state[chatId].Department).toLowerCase()
            , state[chatId].TaskIdentityKeyTime, text).then(res => {
                if(res['resultCode'] == 200) bot.sendMessage(chatId, 'ลบงานเสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
                else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
            }).catch(err => console.log(err));
            state[chatId].state = "Finish";
        }
        //#endregion

        //#region  CompleteSpecific by IdentityKeyTime
        else if (state[chatId].state === "CompleteIdent"){
            state[chatId].state = "DepartmentComplete";
            if(text.indexOf("Operator") === 0){
                state[chatId].Department = "operator";
                bot.sendMessage(chatId, "กรุณาระบุ IdentityKeyTime(eg.3091123883325470_5SEI8)", {"reply_markup": {"force_reply" : true}});

            }
            else if(text.indexOf("Banker") === 0) {
                state[chatId].Department = "banker";
                bot.sendMessage(chatId, "กรุณาระบุ TaskIdentityKeyTime(eg.3091123883325470_5SEI8)", {"reply_markup": {"force_reply" : true}});

            }
            else if(text.indexOf("Updater") === 0) {
                state[chatId].Department = "updater";
                bot.sendMessage(chatId, "กรุณาระบุ TaskIdentityKeyTime(eg.3091123883325470_5SEI8)", {"reply_markup": {"force_reply" : true}});
            }
        }
        else if (state[chatId].state === "DepartmentComplete"){
            if(state[chatId].Department === "operator"){
                bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
                disrupt.completeSpecificWorkOperator(capitalizeFirstLetter(state[chatId].whiteLabel), (state[chatId].Department).toLowerCase()
                , "", text).then(res => {
                    if(res['resultCode'] == 200) bot.sendMessage(chatId, 'แก้ไขงานเสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
                    else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
                }).catch(err => console.log(err));
                state[chatId].state = "Finish";
            }
            else if((state[chatId].Department === "banker") || state[chatId].Department === "updater"){
                state[chatId].state = "CompleteNotOperator";
                state[chatId].TaskIdentityKeyTime = text;
                bot.sendMessage(chatId, "กรุณาระบุ IdentityKeyTime(eg.3091123883325470_5SEI8)", {"reply_markup": {"force_reply" : true}});
            }
        }
        else if (state[chatId].state === "CompleteNotOperator"){
            state[chatId].IdentityKeyTime = text;
            bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
            if(state[chatId].Department === "banker") {
                disrupt.retrieveBanker(capitalizeFirstLetter(state[chatId].whiteLabel),state[chatId].TaskIdentityKeyTime, text).then(res => {
                    console.log(res);
                    if(res['identityKeyTime']){
                        state[chatId].OldBalance = res['oldBalance'];
                        state[chatId].NewBalance = res['newBalance'];
                        state[chatId].state = "ChangeBalance";
                        bot.sendMessage(chatId, 'ต้องการเปลี่ยนแปลง ยอดเก่า(' + res['oldBalance'] + '), ยอดใหม่(' + res['newBalance'] + ')หรือไม่', {"reply_markup": {keyboard:[
                            ["ต้องการเปลียนแปลงเงิน"],
                            ["ไม่ต้องการเปลี่ยนแปลง ทำต่อ"]], resize_keyboard:true}});
                    }
                    else{
                        state[chatId].state = "Finish";
                        bot.sendMessage(chatId, 'ไม่พบงานเสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
                    }
                }).catch(err => console.log(err));
            }
            else if(state[chatId].Department === "updater"){
                disrupt.retrieveUpdater(capitalizeFirstLetter(state[chatId].whiteLabel),state[chatId].TaskIdentityKeyTime, text).then(res => {
                    console.log(res);
                }).catch(err => console.log(err));
            }
        }
        else if(state[chatId].state === "ChangeBalance"){
            if(text.indexOf("ต้องการเปลียนแปลงเงิน") === 0){
                state[chatId].state = "BalanceChange";
                bot.sendMessage(chatId, "กรุณากรอก ยอดเก่า,ยอดใหม่(eg. 30,50)", {"reply_markup": {"force_reply" : true}});
            }
            else if(text.indexOf("ไม่ต้องการเปลี่ยนแปลง ทำต่อ") === 0) {
                bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
                disrupt.completeSpecificWorkBanker(capitalizeFirstLetter(state[chatId].whiteLabel), (state[chatId].Department).toLowerCase()
                , state[chatId].TaskIdentityKeyTime, state[chatId].IdentityKeyTime, state[chatId].OldBalance, state[chatId].NewBalance).then(res => {
                    if(res['resultCode'] == 200) bot.sendMessage(chatId, 'แก้ไขงานเสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
                    else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
                }).catch(err => console.log(err));
                state[chatId].state = "Finish";
            }
        }
        else if (state[chatId].state === "BalanceChange"){
            var balanceArr = text.split(',')
            state[chatId].OldBalance = balanceArr[0];
            state[chatId].NewBalance = balanceArr[1];
            bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
            disrupt.completeSpecificWorkBanker(capitalizeFirstLetter(state[chatId].whiteLabel), (state[chatId].Department).toLowerCase()
            , state[chatId].TaskIdentityKeyTime, state[chatId].IdentityKeyTime, state[chatId].OldBalance, state[chatId].NewBalance).then(res => {
                if(res['resultCode'] == 200) bot.sendMessage(chatId, 'แก้ไขงานเสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
                else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
            }).catch(err => console.log(err));
            state[chatId].state = "Finish";
        }
        //#endregion
        //#endregion

        /*
    ["ต้องการทราบจำนวนคิว"],
    ["เริ่มคิว"],
    ["เคลียร์คิว"],
    ["คิวสเตท"],
    ["คิวสเตททั้งหมด"],    
        */
        //#region Queue Management Command
        else if (state[chatId].state === "QueueManagement"){
            if(text.indexOf("ต้องการทราบจำนวนคิวที่กำหนด") === 0){
                state[chatId].state = "GetQueueByType";
                bot.sendMessage(chatId, "เลือกแผนก Department", {"reply_markup": {"keyboard": department, "resize_keyboard" : true}});
            }
            else if(text.indexOf("เริ่มคิว") === 0){
                state[chatId].state = "BlobWeek";
                bot.sendMessage(chatId, "เลือกคำสั่งการจัดการ Blob", {"reply_markup": {"keyboard": blobweekcommand, "resize_keyboard" : true}});
            }
            else if(text.indexOf("เคลียร์คิว") === 0){
                state[chatId].state = "BlobPartition";
                bot.sendMessage(chatId, "เลือกแผนก Department", {"reply_markup": {"keyboard": department, "resize_keyboard" : true}});
            }
            else if(text.indexOf("คิวสเตท") === 0){
                state[chatId].state = "TopupCredit";
                bot.sendMessage(chatId, "กรอกจำนวนเครดิตที่ต้องการเติม", {"reply_markup": {"force_reply" : true, "resize_keyboard" : true}});
            }
            else if(text.indexOf("คิวสเตททั้งหมด") === 0){
                state[chatId].state = "TopupCredit";
                bot.sendMessage(chatId, "กรอกจำนวนเครดิตที่ต้องการเติม", {"reply_markup": {"force_reply" : true, "resize_keyboard" : true}});
            }
        }
        else if (state[chatId].state === "GetQueueByType"){
            state[chatId].Department = text.toLowerCase();
            state[chatId].state = "QueueNameSize";
            bot.sendMessage(chatId, "ระบุชื่อคิว(eg.Grey_Operator_Storage)", {"reply_markup": {"force_reply" : true, "resize_keyboard" : true}});
        }
        else if (state[chatId].state === "QueueNameSize"){
            bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
            disrupt.GetQueueSize(state[chatId].Department, text).then(res => {
                if(res['resultCode'] == 200) bot.sendMessage(chatId, 'xxxx', {"reply_markup": removeKeyBoard});
                else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
            }).catch(err => console.log(err));
            console.log(res);
            state[chatId].state = "Finish";
        }
        //#endregion

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
