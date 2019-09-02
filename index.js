const express = require('express');
const disrupt = require('./disruptapi');
var https = require("https");
var dotenv = require('dotenv');
dotenv.config();
// https.globalAgent.options.ca = require('ssl-root-cas/latest').create();
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const TelegramBot = require('node-telegram-bot-api');
// const azure = require('azure-storage');

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.BOT_API_KEY;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

var state = {};
const whiteLabels = ["indigo", "grey", "green", "red", "aplus888", "black"];
const whiteLists = ["-339042186", "-311188887"];

var whiteListsChatId = {
    '-339042186': 'production', 
    '-311188887': 'staging',
    '-379846501': 'stg_aplus888'};
var isFound;

const firstPageCommands = [
    ["จัดการทั่วไป"],
    ["จัดการงาน"],
    ["จัดการคิว"],
    ["จัดการความปลอดภัย"],
    ["จัดการบัญชีธนาคาร"]
];
const generalCommands = [
    ["เติมเครดิต"],
    ["สร้าง Blob Week"],
    ["สร้าง Blob Partition"]
];
const workCommands = [
    ["ลบงานโดย TaskIdentityKeyTime"],
    ["แก้ไขงานโดย IdentityKeyTime"],
    ["ตรวจสอบDataกับEvent"]
];
const queueCommands = [
    ["ต้องการทราบจำนวนคิวที่กำหนด"],
    ["จัดการคิวสเตท"],
    ["เคลียร์คิว"],
    ["คิวสเตท"],
    ["แสดงคิวสเตททั้งหมด"],    
];
const securityCommands = [
    ["แสดงรายชื่อคนที่ไม่ได้ยืนยันเครื่อง"],
    ["ติดตั้ง Cert"]
];
const accountBankCommands = [
    ["แสดงรายละเอียดของบัญชีธนาคาร"],
    ["ตรวจสอบความถูกต้องของบัญชีธนาคาร"]
];
const detailBankCommands = [
    ["แสดงรายละเอียดของบัญชีธนาคารที่กำหนด"],
    ["แสดงรายละเอียดของบัญชีธนาคารทั้งหมด"]
];
const checkingBankCommands = [
    ["ตรวจสอบรายการที่สูญหาย"],
    ["ตรวจสอบรายการที่เกิน"],
    ["ตรวจสอบรายการซ้ำกัน"]
];
const checkingBankContCommands = [
    ["แสดงรายละเอียดของบัญชีธนาคารที่กำหนด"],
    ["แสดงรายละเอียดของบัญชีธนาคารทั้งหมด"]
];

var grouped;
var bankListGrouped;
const bankAccountGrouped = new Map();
const accountingCommands = [
];
const bankAccountCommands = [
];

const blobweekcommand = [
    ["สร้างสัปดาห์ล่าสุด"],["ระบุ WeekKeyTime"]];

const department = [
    ["Operator"],
    ["Banker"],
    ["Updater"]
];
const worktype = [
    ["Deposit"],
    ["Withdraw"],
    ["Transfer"],
    ["TaskStorage"]
];
const operatorCustomerDeposit = [
    ["OperatorCreated"],
    ["BankerCreated"],
    ["Matched"],
    ["UpdaterDoing"],
    ["UpdaterCompleted"],
    ["UserDenied"]
];
const operatorCustomerWithdraw = [
    ["OperatorCreated"],
    ["UpdaterDoing"],
    ["UpdaterCompleted"],
    ["BankerDoing"],
    ["BankerCompleted"],
    ["UserDenied"]
];

const operatorCustomerTransfer = [
    ["OperatorCreated"],
    ["UpdaterDoing"],
    ["UpdaterCompleted"],
    ["UserDenied"]
];

const bankerDeposit = [
    ["OperatorCreated"],
    ["BankerCreated"],
    ["Matched"],
    ["UserDenied"],
];

const bankerWithdraw = [
    ["Waiting"],
    ["Ready"],
    ["Doing"],
    ["Complete"],
    ["UserDenied"],
];

const bankerTask = [
    ["UserDenied"],
    ["Complete"]
];

const updaterStatus = [
    ["Waiting"],
    ["Ready"],
    ["Doing"],
    ["Complete"],
    ["UserDenied"]
]; 

const confirm = [
    ["ใช่"],
    ["ไม่ใช่"]
];

const queueState = [
    ["SLEEP"],
    ["PROCESS"]
];
const removeKeyBoard = JSON.stringify({
    remove_keyboard: true
});
const resizeKeyBoard = JSON.stringify({
    resize_keyboard: true
});

// Azure Queue Service
// const queueSvc = azure.createQueueService();
// queueSvc.createQueueIfNotExists('disrupt', function (error, results, response) {
//     if (!error) {
//         // Queue created or exists
//     }
// });

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
    console.log('bot.on Text 02');
    const chatId = msg.chat.id;
    var text = msg.text;
    //console.log(JSON.stringify(text));
    console.log(chatId);
    //console.log(getProperty(chatId.toString()));

    // if (!whiteLists.includes(chatId.toString())) {
    //     console.log("ChatId does not in whiteLists");
    //     return;
    // }

    // var whiteLabel = text.toLowerCase().substring(1);

    // if (!state[chatId]) {
    //     console.log("No state for " + chatId);
    //     state[chatId] = {
    //         id: chatId
    //     };
    // }

    // if (!whiteLabels.includes(whiteLabel)) {
    //     bot.sendMessage(chatId, "ไม่มีสีนี้ในระบบ");
    // } else {

    //     state[chatId].state = "Start";
    //     state[chatId].whiteLabel = whiteLabel;

    //     console.log(JSON.stringify(state));
    //     bot.sendMessage(chatId, "เลือกคำสั่ง", {
    //         "reply_markup": {
    //             "keyboard": firstPageCommands,
    //             resizeKeyBoard
    //         }
    //     });
    // }
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
    console.log('bot.on message');
    const chatId = msg.chat.id;
    var text = msg.text;
    //console.log(getProperty(chatId.toString()));
    // console.log(JSON.stringify(state));
    // console.log(text);
    console.log(chatId)

    // if (!whiteLists.includes(chatId.toString())) {
    //     console.log("ChatId does not in whiteLists");
    //     return;
    // }
    // if (state[chatId]) {
    //     //console.log(state[chatId].state);

    //     //#region First Page Command
    //     if (state[chatId].state === "Start") {
    //         if (text.indexOf("จัดการทั่วไป") === 0) {
    //             state[chatId].state = "GeneralManagement";
    //             bot.sendMessage(chatId, "เลือกคำสั่ง", {"reply_markup": {"keyboard": generalCommands, "resize_keyboard" : true}});
    //         }
    //         else if (text.indexOf("จัดการงาน") === 0) {
    //             state[chatId].state = "WorkManagement";
    //             bot.sendMessage(chatId, "เลือกคำสั่ง", {"reply_markup": {"keyboard": workCommands, "resize_keyboard" : true}});
    //         }
    //         else if (text.indexOf("จัดการคิว") === 0) {
    //             state[chatId].state = "QueueManagement";
    //             bot.sendMessage(chatId, "เลือกคำสั่ง", {"reply_markup": {"keyboard": queueCommands, "resize_keyboard" : true}});
    //         }
    //         else if (text.indexOf("จัดการความปลอดภัย") === 0) {
    //             state[chatId].state = "SecurityManagement";
    //             bot.sendMessage(chatId, "เลือกคำสั่ง", {"reply_markup": {"keyboard": securityCommands, "resize_keyboard" : true}});
    //         }
    //         else if (text.indexOf("จัดการบัญชีธนาคาร") === 0){
    //             state[chatId].state = "BankAccountManagement";
    //             bot.sendMessage(chatId, "เลือกคำสั่ง", {"reply_markup": {"keyboard": accountBankCommands, "resize_keyboard" : true}});

    //             // accountingCommands.length = 0;
    //             // bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //             // disrupt.checkAllBankConsistensy(capitalizeFirstLetter(state[chatId].whiteLabel)).then(res => {
    //             //     // console.log(JSON.stringify(res));
    //             //     // console.log(JSON.stringify(res['contract']));
    //             //     //console.log(JSON.stringify(res['contract']['accountingResultContract']));
    //             //     res['contract']['accountingResultContract'].forEach(element => {
    //             //         //console.log(element);
    //             //         bot.sendMessage(chatId, `${element['bankName']}\n${element['deposits']}\n${element['withdraws']}\n${element['extraDeposits']}\n${element['extraWithdraws']}\n${element['extraExpenses']}\n`, {"reply_markup": removeKeyBoard});
    //             //     });
    //             //     bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //             //     state[chatId].state = "Finish";

    //             //     // if(res['resultCode'] == 200){
    //             //     //     console.log(res);
    //             //     // }
    //             //     // else {
    //             //     //     bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //             //     //     state[chatId].state = "Finish";
    //             //     // }
    //             // }).catch(err => console.log(err));

    //             // // disrupt.getBankList(capitalizeFirstLetter(state[chatId].whiteLabel)).then(res => {
    //             // //     if(res['resultCode'] == 200){
    //             // //         grouped = groupBy(res['contract']['bankList'], accountName => accountName.accountName);
    //             // //         var iterator1 = grouped.keys();
    //             // //         for(var i = 0; i < grouped.size ; i++){
    //             // //             accountingCommands.push(new Array(iterator1.next().value));
    //             // //         }
    //             // //         state[chatId].state = "AccountRetrieved";
    //             // //         bot.sendMessage(chatId, "เลือกชื่อบัญชี", {"reply_markup": {"keyboard": accountingCommands, "resize_keyboard" : true}});
    //             // //     }
    //             // //     else {
    //             // //         bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //             // //         state[chatId].state = "Finish";
    //             // //     }
    //             // // }).catch(err => console.log(err));
    //         }
    //     }
    //     //#endregion

    //     //#region General Management Command
    //     else if (state[chatId].state === "GeneralManagement"){
    //         if(text.indexOf("เติมเครดิต") === 0){
    //             state[chatId].state = "TopupCredit";
    //             bot.sendMessage(chatId, "กรอกจำนวนเครดิตที่ต้องการเติม", {"reply_markup": {"force_reply" : true, "resize_keyboard" : true}});
    //         }
    //         else if(text.indexOf("สร้าง Blob Week") === 0){
    //             state[chatId].state = "BlobWeek";
    //             bot.sendMessage(chatId, "เลือกคำสั่งการจัดการ Blob", {"reply_markup": {"keyboard": blobweekcommand, "resize_keyboard" : true}});
    //         }
    //         else if(text.indexOf("สร้าง Blob Partition") === 0){
    //             state[chatId].state = "BlobPartition";
    //             bot.sendMessage(chatId, "เลือกแผนก Department", {"reply_markup": {"keyboard": department, "resize_keyboard" : true}});
    //         }
    //     }
    //     //#region Topup Credit
    //     else if (state[chatId].state === "TopupCredit"){
    //         var isNumber = /^\d+$/.test(text);
    //         if(isNumber){
    //             bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //             disrupt.topupCredit(capitalizeFirstLetter(state[chatId].whiteLabel), text).then(res => {
    //                 if(res['resultCode'] == 200) bot.sendMessage(chatId, 'เติมเครดิตเสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
    //                 else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //             }).catch(err => console.log(err));
    //             state[chatId].state = "Finish";
    //         }
    //         else{
    //             bot.sendMessage(chatId, "กรุณากรอกตัวเลขจำนวนเต็มเท่านั้น", {"reply_markup": {"force_reply" : true, "resize_keyboard" : true}});
    //         }
    //     }
    //     //#endregion

    //     //#region BlobWeek
    //     else if (state[chatId].state === "BlobWeek"){
    //         if(text.indexOf("สร้างสัปดาห์ล่าสุด") === 0){
    //             bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //             disrupt.createBlobByWeekKeyTime(capitalizeFirstLetter(state[chatId].whiteLabel), "").then(res => {
    //                 if(res['resultCode'] == 200) bot.sendMessage(chatId, 'สร้าง Blob เสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
    //                 else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //             }).catch(err => console.log(err));
    //             state[chatId].state = "Finish";
    //         }
    //         else if(text.indexOf("ระบุ WeekKeyTime") === 0){
    //             state[chatId].state = "WeekKeyTimeBlob";
    //             bot.sendMessage(chatId, "กรุณาระบุ WeekKeyTime(eg.3091260600000000)", {"reply_markup": {"force_reply" : true}});
    //         }
    //     }
    //     else if(state[chatId].state === "WeekKeyTimeBlob"){
    //         var isNumber = /^\d+$/.test(text);
    //         if(isNumber && text.toString().length == 16){
    //             bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //             disrupt.createBlobByWeekKeyTime(capitalizeFirstLetter(state[chatId].whiteLabel), text).then(res => {
    //                 if(res['resultCode'] == 200) bot.sendMessage(chatId, 'สร้าง Blob เสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
    //                 else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //             }).catch(err => console.log(err));
    //             state[chatId].state = "Finish";
    //         }
    //         else{
    //             bot.sendMessage(chatId, "กรุณากรอกตัวเลขจำนวน 16 หลักเท่านั้น(eg.3091260600000000)", {"reply_markup": {"force_reply" : true, "resize_keyboard" : true}});
    //         }
    //     }
    //     //#endregion

    //     //#region  Blob Partition
    //     else if (state[chatId].state === "BlobPartition"){
    //         state[chatId].state = "WeekKeyTime"
    //         if(text.indexOf("Operator") === 0) state[chatId].Department = "operator"
    //         else if(text.indexOf("Banker") === 0) state[chatId].Department = "banker"
    //         else if(text.indexOf("Updater") === 0) state[chatId].Department = "updater"
    //         bot.sendMessage(chatId, "กรุณาระบุ WeekKeyTime(eg.3091260600000000)", {"reply_markup": {"force_reply" : true}});
    //     }
    //     else if (state[chatId].state === "WeekKeyTime"){
    //         var isNumber = /^\d+$/.test(text);
    //         if(isNumber && text.toString().length == 16){
    //             state[chatId].state = "PartitionNumber";
    //             state[chatId].WeekKeyTime = text;
    //             bot.sendMessage(chatId, "กรุณาระบุ Partition(eg.9999999999)", {"reply_markup": {"force_reply" : true}});
    //         }
    //         else{
    //             bot.sendMessage(chatId, "กรุณากรอกตัวเลขจำนวน 16 หลักเท่านั้น(eg.3091260600000000)", {"reply_markup": {"force_reply" : true, "resize_keyboard" : true}});
    //         }
    //     }
    //     else if (state[chatId].state === "PartitionNumber"){
    //         var isNumber =  /^\d+$/.test(text);
    //         if(isNumber && text.toString().length == 10){
    //             state[chatId].state = "AccountPattern";
    //             state[chatId].Partition = text;
    //             bot.sendMessage(chatId, "กรุณาระบุ AccountPatter(Thai = 1, Inter = 2)", {"reply_markup": {"force_reply" : true}});
    //         }
    //         else{
    //             bot.sendMessage(chatId, "กรุณากรอกตัวเลขจำนวน 10 หลักเท่านั้น(eg.9999999999)", {"reply_markup": {"force_reply" : true, "resize_keyboard" : true}});
    //         }
    //     }
    //     else if (state[chatId].state === "AccountPattern"){
    //         var isNumber =  /^\d+$/.test(text);
    //         if(isNumber && text.toString().length == 1 && (text == 1 || text == 2)){
    //             bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //             disrupt.createBlobByPartition(state[chatId].Department, capitalizeFirstLetter(state[chatId].whiteLabel), state[chatId].WeekKeyTime
    //             ,state[chatId].Partition, text).then(res => {
    //                 if(res['resultCode'] == 200) bot.sendMessage(chatId, 'สร้าง Blob Partition เสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
    //                 else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //             }).catch(err => console.log(err));
    //             state[chatId].state = "Finish";
    //         }
    //         else{
    //             bot.sendMessage(chatId, "กรุณาระบุ AccountPatter(Thai = 1, Inter = 2)", {"reply_markup": {"force_reply" : true, "resize_keyboard" : true}});
    //         }
    //     }
    //     //#endregion
    //     //#endregion

    //     //#region  WorkTask Management Command
    //     else if (state[chatId].state === "WorkManagement"){
    //         if(text.indexOf("ลบงานโดย TaskIdentityKeyTime") === 0){
    //             state[chatId].state = "TaskIdentDelete";
    //             bot.sendMessage(chatId, "กรุณาระบุ TaskIdentityKeyTime(eg.3091112131567160_OAOUY)", {"reply_markup": {"force_reply" : true}});
    //         }
    //         else if(text.indexOf("แก้ไขงานโดย IdentityKeyTime") === 0){
    //             state[chatId].state = "commitbyIden";
    //             bot.sendMessage(chatId, "เลือกแผนก Department", {"reply_markup": {"keyboard": department, "resize_keyboard" : true}});
    //         }
    //         else if(text.indexOf("ตรวจสอบDataกับEvent") === 0){
    //             state[chatId].state = "checkdataevent";
    //             bot.sendMessage(chatId, "เลือกแผนก Department", {"reply_markup": {"keyboard": department, "resize_keyboard" : true}});
    //         }
    //     }

    //     //#region Delete by TaskIdentityKeyTime
    //     else if(state[chatId].state === "TaskIdentDelete"){
    //         var arrTaskIdentityKeyTime = text.split('_');
    //         if(arrTaskIdentityKeyTime != null){
    //             var TaskPrefix = arrTaskIdentityKeyTime[0];
    //             var TaskSuffix = arrTaskIdentityKeyTime[1];
    //             if(TaskPrefix.toString().length == 16 && /^\d+$/.test(TaskPrefix) && TaskSuffix.toString().length == 5){
    //                 bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //                 disrupt.deleteWorkByTaskIdentityKeyTime(capitalizeFirstLetter(state[chatId].whiteLabel), text).then(res => {
    //                     if(res['resultCode'] == 200) bot.sendMessage(chatId, 'ลบงานเสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
    //                     else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //                 }).catch(err => console.log(err));
    //                 state[chatId].state = "Finish";
    //             }
    //             else{
    //                 bot.sendMessage(chatId, "กรุณากรอก TaskIdentityKeyTime ให้ถูกต้อง(eg.3091112131567160_OAOUY)", {"reply_markup": {"force_reply" : true, "resize_keyboard" : true}});
    //             }
    //         }
    //         else{
    //             bot.sendMessage(chatId, "กรุณากรอก TaskIdentityKeyTime ให้ถูกต้อง(eg.3091112131567160_OAOUY)", {"reply_markup": {"force_reply" : true, "resize_keyboard" : true}});
    //         }
    //     }
    //     //#endregion

    //     //#region  CommitEvent by IdentityKeyTime
    //     else if (state[chatId].state === "commitbyIden"){
    //         state[chatId].state = "ChooseDepartmentCommit";
    //         if(text.indexOf("Operator") === 0){
    //             state[chatId].Department = "operator";
    //             bot.sendMessage(chatId, "กรุณาระบุ IdentityKeyTime(eg.3091123883325470_5SEI8)", {"reply_markup": {"force_reply" : true}});
    //         }
    //         else if(text.indexOf("Banker") === 0) {
    //             state[chatId].Department = "banker";
    //             bot.sendMessage(chatId, "กรุณาระบุ TaskIdentityKeyTime(eg.3091123883325470_5SEI8)", {"reply_markup": {"force_reply" : true}});
    //         }
    //         else if(text.indexOf("Updater") === 0) {
    //             state[chatId].Department = "updater";
    //             bot.sendMessage(chatId, "กรุณาระบุ TaskIdentityKeyTime(eg.3091123883325470_5SEI8)", {"reply_markup": {"force_reply" : true}});
    //         }
    //     }
    //     else if (state[chatId].state === "ChooseDepartmentCommit"){
    //         var arrTaskIdentityKeyTime = text.split('_');
    //         if(arrTaskIdentityKeyTime != null){
    //             var TaskPrefix = arrTaskIdentityKeyTime[0];
    //             var TaskSuffix = arrTaskIdentityKeyTime[1];
    //             if(TaskPrefix.toString().length == 16 && /^\d+$/.test(TaskPrefix) && TaskSuffix.toString().length == 5){
    //                 if(state[chatId].Department === "operator"){
    //                     bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //                     disrupt.retrieveOperator(capitalizeFirstLetter(state[chatId].whiteLabel)
    //                     , text).then(res => {
    //                         if(res['identityKeyTime'] != null){
    //                             state[chatId].state = "StatusChoose";
    //                             state[chatId].IdentityKeyTime = res['identityKeyTime'];
    //                             if(res['operatorType'] == 0 || res['operatorType'] == 4){
    //                                 bot.sendMessage(chatId
    //                                     , "เลือกสถานะ"
    //                                     , {"reply_markup": {"keyboard": operatorCustomerDeposit, "resize_keyboard" : true}});
    //                             }
    //                             else if (res['operatorType'] == 1){
    //                                 bot.sendMessage(chatId
    //                                     , "เลือกสถานะ"
    //                                     , {"reply_markup": {"keyboard": operatorCustomerWithdraw, "resize_keyboard" : true}});
    //                             }
    //                             else if (res['operatorType'] == 2 || res['operatorType'] == 3){
    //                                 bot.sendMessage(chatId
    //                                     , "เลือกสถานะ"
    //                                     , {"reply_markup": {"keyboard": operatorCustomerTransfer, "resize_keyboard" : true}});
    //                             }
    //                         }
    //                         else{
    //                             bot.sendMessage(chatId, "ไม่พบงาน", {"reply_markup": removeKeyBoard});
    //                         }
    //                     }).catch(err => console.log(err));
    //                     state[chatId].state = "Finish";
    //                 }
    //                 else if((state[chatId].Department === "banker") || state[chatId].Department === "updater"){
    //                     state[chatId].state = "NotOperator";
    //                     state[chatId].TaskIdentityKeyTime = text;
    //                     bot.sendMessage(chatId, "กรุณาระบุ IdentityKeyTime(eg.3091123883325470_5SEI8)", {"reply_markup": {"force_reply" : true}});
    //                 }
    //             }
    //             else{
    //                 if(state[chatId].Department === "operator"){
    //                     bot.sendMessage(chatId, "กรุณากรอก IdentityKeyTime ให้ถูกต้อง(eg.3091112131567160_OAOUY)", {"reply_markup": {"force_reply" : true, "resize_keyboard" : true}});
    //                 }
    //                 else{
    //                     bot.sendMessage(chatId, "กรุณากรอก TaskIdentityKeyTime ให้ถูกต้อง(eg.3091112131567160_OAOUY)", {"reply_markup": {"force_reply" : true, "resize_keyboard" : true}});
    //                 }
    //             }
    //         }
    //         else{
    //             if(state[chatId].Department === "operator"){
    //                 bot.sendMessage(chatId, "กรุณากรอก IdentityKeyTime ให้ถูกต้อง(eg.3091112131567160_OAOUY)", {"reply_markup": {"force_reply" : true, "resize_keyboard" : true}});
    //             }  
    //             else{
    //                 bot.sendMessage(chatId, "กรุณากรอก TaskIdentityKeyTime ให้ถูกต้อง(eg.3091112131567160_OAOUY)", {"reply_markup": {"force_reply" : true, "resize_keyboard" : true}});
    //             }          
    //         }
    //     }
    //     else if (state[chatId].state === "NotOperator"){
    //         state[chatId].IdentityKeyTime = text;
    //         var arrIdentityKeyTime = text.split('_');
    //         if(arrIdentityKeyTime != null){
    //             var TaskPrefix = arrIdentityKeyTime[0];
    //             var TaskSuffix = arrIdentityKeyTime[1];
    //             if(TaskPrefix.toString().length == 16 && /^\d+$/.test(TaskPrefix) && TaskSuffix.toString().length == 5){
    //                 if(state[chatId].Department === "banker"){
    //                     bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //                     disrupt.retrieveBanker(capitalizeFirstLetter(state[chatId].whiteLabel)
    //                     , state[chatId].TaskIdentityKeyTime, state[chatId].IdentityKeyTime).then(res => {
    //                         if(res['identityKeyTime'] != null){
    //                             state[chatId].state = "StatusChoose";
    //                             state[chatId].OldBalance = res['oldBalance'];
    //                             state[chatId].NewBalance = res['newBalance'];
    //                             state[chatId].Amount = res['amount'];
    //                             if(res['bankerType'] == 0){
    //                                 bot.sendMessage(chatId
    //                                     , "เลือกสถานะ"
    //                                     , {"reply_markup": {"keyboard": bankerDeposit, "resize_keyboard" : true}});
    //                             }
    //                             else if (res['bankerType'] == 1){
    //                                 bot.sendMessage(chatId
    //                                     , "เลือกสถานะ"
    //                                     , {"reply_markup": {"keyboard": bankerWithdraw, "resize_keyboard" : true}});
    //                             }
    //                             else if (res['bankerType'] == 2 || res['bankerType'] == 3 || res['bankerType'] == 4){
    //                                 bot.sendMessage(chatId
    //                                     , "เลือกสถานะ"
    //                                     , {"reply_markup": {"keyboard": bankerTask, "resize_keyboard" : true}});
    //                             }
    //                         }
    //                         else{
    //                             bot.sendMessage(chatId, "ไม่พบงาน", {"reply_markup": removeKeyBoard});
    //                         }
    //                     }).catch(err => console.log(err));
    //                     state[chatId].state = "Finish";
    //                 }
    //                 else if(state[chatId].Department === "updater"){
    //                     bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //                     disrupt.retrieveUpdater(capitalizeFirstLetter(state[chatId].whiteLabel)
    //                     , state[chatId].TaskIdentityKeyTime, state[chatId].IdentityKeyTime).then(res => {
    //                         if(res['identityKeyTime'] != null){
    //                             state[chatId].state = "StatusChoose";
    //                             state[chatId].OldBalance = res['oldBalance'];
    //                             state[chatId].NewBalance = res['newBalance'];
    //                             state[chatId].OldCredit = res['oldCredit'];
    //                             state[chatId].NewCredit = res['newCredit'];
    //                             state[chatId].Amount = res['amount'];
    //                             bot.sendMessage(chatId
    //                                 , "เลือกสถานะ"
    //                                 , {"reply_markup": {"keyboard": updaterStatus, "resize_keyboard" : true}});
    //                         }
    //                         else{
    //                             bot.sendMessage(chatId, "ไม่พบงาน", {"reply_markup": removeKeyBoard});
    //                         }
    //                     }).catch(err => console.log(err));
    //                     state[chatId].state = "Finish";
    //                 }   
    //             }
    //             else{
    //                 bot.sendMessage(chatId, "กรุณากรอก IdentityKeyTime ให้ถูกต้อง(eg.3091112131567160_OAOUY)", {"reply_markup": {"force_reply" : true, "resize_keyboard" : true}});
    //             }
    //         }
    //         else{
    //             bot.sendMessage(chatId, "กรุณากรอก IdentityKeyTime ให้ถูกต้อง(eg.3091112131567160_OAOUY)", {"reply_markup": {"force_reply" : true, "resize_keyboard" : true}});
    //         }
                     
    //     }
    //     else if (state[chatId].state === "StatusChoose"){
    //         state[chatId].eventstatus = text;
    //         if(state[chatId].Department === "operator"){
    //             bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //             disrupt.completeSpecificWorkOperator(capitalizeFirstLetter(state[chatId].whiteLabel), (state[chatId].Department).toLowerCase()
    //             , state[chatId].IdentityKeyTime, state[chatId].eventstatus).then(res => {
    //                 if(res['resultCode'] == 200) bot.sendMessage(chatId, 'แก้ไขเสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
    //                 else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //             }).catch(err => console.log(err));
    //             state[chatId].state = "Finish";
    //         }
    //         else if(state[chatId].Department === "banker"){
    //             state[chatId].state = "BankerChangeBalance";
    //             bot.sendMessage(chatId
    //                 , 'ต้องการเปลี่ยนแปลง ยอดเก่า(' + state[chatId].OldBalance + '), ยอดใหม่(' + state[chatId].NewBalance + ')หรือไม่', {"reply_markup": {keyboard:[
    //                 ["ต้องการเปลียนแปลงเงิน"],
    //                 ["ไม่ต้องการเปลี่ยนแปลง ทำต่อ"]], resize_keyboard:true}});
    //         }
    //         else if(state[chatId].Department === "updater"){
    //             state[chatId].state = "UpdaterChangeBalance";
    //             bot.sendMessage(chatId
    //                 , 'ต้องการเปลี่ยนแปลง ยอดเก่า('+state[chatId].OldBalance+'), ยอดใหม่('+state[chatId].NewBalance+') ยอดเครดิตเก่า('+state[chatId].OldCredit+'), ยอดเครดิตใหม่('+state[chatId].NewCredit +')หรือไม่'
    //                 , {"reply_markup": {keyboard:[
    //                 ["ต้องการเปลียนแปลงเงิน"],
    //                 ["ไม่ต้องการเปลี่ยนแปลง ทำต่อ"]], resize_keyboard:true}});
    //         }
    //     }
    //     else if(state[chatId].state === "BankerChangeBalance"){
    //         if(text.indexOf("ต้องการเปลียนแปลงเงิน") === 0){
    //             state[chatId].state = "BankerBalanceChange";
    //             bot.sendMessage(chatId, "จำนวนคือ "+ state[chatId].Amount +" กรุณากรอก ยอดเก่า,ยอดใหม่(eg. 30,50)", {"reply_markup": {"force_reply" : true}});
    //         }
    //         else if(text.indexOf("ไม่ต้องการเปลี่ยนแปลง ทำต่อ") === 0) {
    //             bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //             disrupt.commitWorkBanker(capitalizeFirstLetter(state[chatId].whiteLabel), (state[chatId].Department).toLowerCase()
    //             , state[chatId].TaskIdentityKeyTime, state[chatId].IdentityKeyTime, state[chatId].eventstatus, state[chatId].OldBalance, state[chatId].NewBalance).then(res => {
    //                 if(res['resultCode'] == 200) bot.sendMessage(chatId, 'แก้ไขงานเสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
    //                 else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //             }).catch(err => console.log(err));
    //             state[chatId].state = "Finish";
    //         }
    //     }
    //     else if (state[chatId].state === "BankerBalanceChange"){
    //         var balanceArr = text.split(',')
    //         state[chatId].OldBalance = balanceArr[0];
    //         state[chatId].NewBalance = balanceArr[1];
    //         if(balanceArr != null && balanceArr[0] != null && balanceArr[1] != null && /^\d+$/.test(balanceArr[0]) && /^\d+$/.test(balanceArr[1])){
    //             bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //             disrupt.commitWorkBanker(capitalizeFirstLetter(state[chatId].whiteLabel), (state[chatId].Department).toLowerCase()
    //             , state[chatId].TaskIdentityKeyTime, state[chatId].IdentityKeyTime, state[chatId].eventstatus, state[chatId].OldBalance, state[chatId].NewBalance).then(res => {
    //                 if(res['resultCode'] == 200) bot.sendMessage(chatId, 'แก้ไขงานเสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
    //                 else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //             }).catch(err => console.log(err));
    //             state[chatId].state = "Finish";
    //         }
    //         else{
    //             bot.sendMessage(chatId, "กรุณากรอก ยอดเก่า,ยอดใหม่(eg. 30,50) ให้ถูกต้อง", {"reply_markup": {"force_reply" : true, "resize_keyboard" : true}});
    //         }
    //     }
    //     else if(state[chatId].state === "UpdaterChangeBalance"){
    //         if(text.indexOf("ต้องการเปลียนแปลงเงิน") === 0){
    //             state[chatId].state = "UpdaterBalanceChange";
    //             bot.sendMessage(chatId,"จำนวนคือ "+ state[chatId].Amount + "กรุณากรอก ยอดเก่า,ยอดใหม่,ยอดเครดิตเก่า,ยอดเครดิตใหม่(eg. 30,50,0,10)", {"reply_markup": {"force_reply" : true}});
    //         }
    //         else if(text.indexOf("ไม่ต้องการเปลี่ยนแปลง ทำต่อ") === 0) {
    //             console.log(state[chatId].OldBalance+", "+state[chatId].NewBalance+", "+state[chatId].OldCredit+", "+state[chatId].NewCredit)
    //             bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //             disrupt.commitWorkUpdater(capitalizeFirstLetter(state[chatId].whiteLabel), (state[chatId].Department).toLowerCase()
    //             , state[chatId].TaskIdentityKeyTime, state[chatId].IdentityKeyTime, state[chatId].eventstatus, state[chatId].OldBalance, state[chatId].NewBalance
    //             ,state[chatId].OldCredit, state[chatId].NewCredit).then(res => {
    //                 if(res['resultCode'] == 200) bot.sendMessage(chatId, 'แก้ไขงานเสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
    //                 else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //             }).catch(err => console.log(err));
    //             state[chatId].state = "Finish";
    //         }
    //     }
    //     else if (state[chatId].state === "UpdaterBalanceChange"){
    //         var balanceArr = text.split(',')
    //         state[chatId].OldBalance = balanceArr[0];
    //         state[chatId].NewBalance = balanceArr[1];
    //         state[chatId].OldCredit = balanceArr[2];
    //         state[chatId].NewCredit = balanceArr[3];
    //         if(balanceArr != null && balanceArr[0] != null && balanceArr[1] != null && balanceArr[2] != null && balanceArr[3] != null
    //             && /^\d+$/.test(balanceArr[0]) && /^\d+$/.test(balanceArr[1]) && /^\d+$/.test(balanceArr[2]) && /^\d+$/.test(balanceArr[3])){
    //                 bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //                 disrupt.commitWorkUpdater(capitalizeFirstLetter(state[chatId].whiteLabel), (state[chatId].Department).toLowerCase()
    //                 , state[chatId].TaskIdentityKeyTime, state[chatId].IdentityKeyTime, state[chatId].eventstatus
    //                 , state[chatId].OldBalance, state[chatId].NewBalance, state[chatId].OldCredit, state[chatId].NewCredit).then(res => {
    //                     if(res['resultCode'] == 200) bot.sendMessage(chatId, 'แก้ไขงานเสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
    //                     else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //                 }).catch(err => console.log(err));
    //                 state[chatId].state = "Finish";
    //         }
    //         else{
    //             bot.sendMessage(chatId, "กรุณากรอก ยอดเก่า,ยอดใหม่,ยอดเครดิตเก่า,ยอดเครดิตใหม่(eg. 30,50,0,10) ให้ถูกต้อง", {"reply_markup": {"force_reply" : true, "resize_keyboard" : true}});
    //         }
    //     }
    //     //#endregion

    //     //#region  CheckDataAndEvent
    //     else if(state[chatId].state === "checkdataevent"){
    //         state[chatId].state = "departChooseCheck";
    //         if(text.indexOf("Operator") === 0){
    //             state[chatId].Department = "operator";
    //             bot.sendMessage(chatId, "กรุณาระบุ IdentityKeyTime(eg.3091123883325470_5SEI8)", {"reply_markup": {"force_reply" : true}});
    //         }
    //         else if(text.indexOf("Banker") === 0) {
    //             state[chatId].Department = "banker";
    //             bot.sendMessage(chatId, "กรุณาระบุ TaskIdentityKeyTime(eg.3091123883325470_5SEI8)", {"reply_markup": {"force_reply" : true}});
    //         }
    //         else if(text.indexOf("Updater") === 0) {
    //             state[chatId].Department = "updater";
    //             bot.sendMessage(chatId, "กรุณาระบุ TaskIdentityKeyTime(eg.3091123883325470_5SEI8)", {"reply_markup": {"force_reply" : true}});
    //         }
    //     }
    //     else if (state[chatId].state === "departChooseCheck"){
    //         var arrTaskIdentityKeyTime = text.split('_');
    //         if(arrTaskIdentityKeyTime != null){
    //             var TaskPrefix = arrTaskIdentityKeyTime[0];
    //             var TaskSuffix = arrTaskIdentityKeyTime[1];
    //             if(TaskPrefix.toString().length == 16 && /^\d+$/.test(TaskPrefix) && TaskSuffix.toString().length == 5){
    //                 if(state[chatId].Department === "operator"){
    //                     bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //                     disrupt.retrieveOperator(capitalizeFirstLetter(state[chatId].whiteLabel)
    //                     , text).then(res => {
    //                         console.log(res);
    //                         if(res['identityKeyTime'] != null){
    //                             state[chatId].IdentityKeyTime = res['identityKeyTime'];
    //                             state[chatId].DataVersion = res['version'];
    //                             state[chatId].DataStatus = res['status'];
        
    //                             disrupt.retrieveOperatorEvent(capitalizeFirstLetter(state[chatId].whiteLabel)
    //                             , text).then(res => {
    //                                 console.log(res);
    //                                 if(res['identityKeyTime'] != null){
    //                                     state[chatId].IdentityKeyTime = res['identityKeyTime'];
    //                                     state[chatId].EventVersion = res['version'];
    //                                     state[chatId].EventStatus = res['status'];
        
    //                                     if(state[chatId].DataVersion.indexOf(state[chatId].EventVersion) === -1 && state[chatId].DataStatus != state[chatId].EventStatus){
    //                                         state[chatId].state = "fixOperatorEvent";
    //                                         bot.sendMessage(chatId, "ต้องการแก้ไขให้ถูกต้องหรือไม่ (DataVersion,EventVersion)=>"
    //                                         + "("+state[chatId].DataVersion+","+state[chatId].EventVersion+") // (DataStatus,EventStatus)=>"
    //                                         + "("+state[chatId].DataStatus+","+state[chatId].EventStatus+")", {"reply_markup": {"keyboard": confirm, "resize_keyboard" : true}});
    //                                     }
    //                                     else if(state[chatId].DataVersion.indexOf(state[chatId].EventVersion) === 0 && state[chatId].DataStatus == state[chatId].EventStatus){
    //                                         bot.sendMessage(chatId, "งานตรวจสอบถูกต้องแล้ว", {"reply_markup": removeKeyBoard});
    //                                         state[chatId].state = "Finish";
    //                                     }
    //                                 }
    //                                 else{
    //                                     bot.sendMessage(chatId, "ไม่พบงาน", {"reply_markup": removeKeyBoard});
    //                                     state[chatId].state = "Finish";                            }
    //                             }).catch(err => console.log(err));
    //                         }
    //                         else{
    //                             bot.sendMessage(chatId, "ไม่พบงาน", {"reply_markup": removeKeyBoard});
    //                             state[chatId].state = "Finish";
    //                         }
    //                     }).catch(err => console.log(err));
    //                 }
    //                 else if((state[chatId].Department === "banker") || state[chatId].Department === "updater"){
    //                     state[chatId].state = "CheckNotOperator";
    //                     state[chatId].TaskIdentityKeyTime = text;
    //                     bot.sendMessage(chatId, "กรุณาระบุ IdentityKeyTime(eg.3091123883325470_5SEI8)", {"reply_markup": {"force_reply" : true}});
    //                 }
    //             }
    //             else{
    //                 if(state[chatId].Department === "operator"){
    //                     bot.sendMessage(chatId, "กรุณากรอก IdentityKeyTime ให้ถูกต้อง(eg.3091112131567160_OAOUY)", {"reply_markup": {"force_reply" : true, "resize_keyboard" : true}});
    //                 }  
    //                 else{
    //                     bot.sendMessage(chatId, "กรุณากรอก TaskIdentityKeyTime ให้ถูกต้อง(eg.3091112131567160_OAOUY)", {"reply_markup": {"force_reply" : true, "resize_keyboard" : true}});
    //                 }    
    //             }
    //         }
    //         else{
    //             if(state[chatId].Department === "operator"){
    //                 bot.sendMessage(chatId, "กรุณากรอก IdentityKeyTime ให้ถูกต้อง(eg.3091112131567160_OAOUY)", {"reply_markup": {"force_reply" : true, "resize_keyboard" : true}});
    //             }  
    //             else{
    //                 bot.sendMessage(chatId, "กรุณากรอก TaskIdentityKeyTime ให้ถูกต้อง(eg.3091112131567160_OAOUY)", {"reply_markup": {"force_reply" : true, "resize_keyboard" : true}});
    //             }    
    //         }
    //     }
    //     else if (state[chatId].state === "CheckNotOperator"){
    //         state[chatId].IdentityKeyTime = text;
    //         var arrIdentityKeyTime = text.split('_');
    //         if(arrIdentityKeyTime != null){
    //             var TaskPrefix = arrIdentityKeyTime[0];
    //             var TaskSuffix = arrIdentityKeyTime[1];
    //             if(TaskPrefix.toString().length == 16 && /^\d+$/.test(TaskPrefix) && TaskSuffix.toString().length == 5){
    //                 if(state[chatId].Department === "banker"){
    //                     bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //                     disrupt.retrieveBanker(capitalizeFirstLetter(state[chatId].whiteLabel)
    //                     ,state[chatId].TaskIdentityKeyTime, state[chatId].IdentityKeyTime).then(res => {
    //                         console.log(res);
    //                         if(res['identityKeyTime'] != null){
    //                             state[chatId].DataVersion = res['version'];
    //                             state[chatId].DataStatus = res['status'];
        
    //                             disrupt.retrieveBankerEvent(capitalizeFirstLetter(state[chatId].whiteLabel)
    //                             ,state[chatId].TaskIdentityKeyTime, state[chatId].IdentityKeyTime).then(res => {
    //                                 console.log(res);
    //                                 if(res['identityKeyTime'] != null){
    //                                     state[chatId].EventVersion = res['version'];
    //                                     state[chatId].EventStatus = res['status'];
        
    //                                     if(state[chatId].DataVersion.indexOf(state[chatId].EventVersion) === -1 && state[chatId].DataStatus != state[chatId].EventStatus){
    //                                         state[chatId].state = "fixBankerEvent";
    //                                         bot.sendMessage(chatId, "ต้องการแก้ไขให้ถูกต้องหรือไม่ (DataVersion,EventVersion)=>"
    //                                         + "("+state[chatId].DataVersion+","+state[chatId].EventVersion+") // (DataStatus,EventStatus)=>"
    //                                         + "("+state[chatId].DataStatus+","+state[chatId].EventStatus+")", {"reply_markup": {"keyboard": confirm, "resize_keyboard" : true}});
    //                                     }
    //                                     else if(state[chatId].DataVersion.indexOf(state[chatId].EventVersion) === 0 && state[chatId].DataStatus == state[chatId].EventStatus){
    //                                         bot.sendMessage(chatId, "งานตรวจสอบถูกต้องแล้ว", {"reply_markup": removeKeyBoard});
    //                                         state[chatId].state = "Finish";
    //                                     }
    //                                 }
    //                                 else{
    //                                     bot.sendMessage(chatId, "ไม่พบงาน", {"reply_markup": removeKeyBoard});
    //                                     state[chatId].state = "Finish";                            }
    //                             }).catch(err => console.log(err));
    //                         }
    //                         else{
    //                             bot.sendMessage(chatId, "ไม่พบงาน", {"reply_markup": removeKeyBoard});
    //                             state[chatId].state = "Finish";
    //                         }
    //                     }).catch(err => console.log(err));
    //                 }
    //                 else if(state[chatId].Department === "updater"){
    //                     bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //                     disrupt.retrieveUpdater(capitalizeFirstLetter(state[chatId].whiteLabel)
    //                     ,state[chatId].TaskIdentityKeyTime, state[chatId].IdentityKeyTime).then(res => {
    //                         console.log(res);
    //                         if(res['identityKeyTime'] != null){
    //                             state[chatId].DataVersion = res['version'];
    //                             state[chatId].DataStatus = res['status'];
        
    //                             disrupt.retrieveUpdaterEvent(capitalizeFirstLetter(state[chatId].whiteLabel)
    //                             ,state[chatId].TaskIdentityKeyTime, state[chatId].IdentityKeyTime).then(res => {
    //                                 console.log(res);
    //                                 if(res['identityKeyTime'] != null){
    //                                     state[chatId].EventVersion = res['version'];
    //                                     state[chatId].EventStatus = res['status'];
        
    //                                     if(state[chatId].DataVersion.indexOf(state[chatId].EventVersion) === -1 && state[chatId].DataStatus != state[chatId].EventStatus){
    //                                         state[chatId].state = "fixUpdaterEvent";
    //                                         bot.sendMessage(chatId, "ต้องการแก้ไขให้ถูกต้องหรือไม่ (DataVersion,EventVersion)=>"
    //                                         + "("+state[chatId].DataVersion+","+state[chatId].EventVersion+") // (DataStatus,EventStatus)=>"
    //                                         + "("+state[chatId].DataStatus+","+state[chatId].EventStatus+")", {"reply_markup": {"keyboard": confirm, "resize_keyboard" : true}});
    //                                     }
    //                                     else if(state[chatId].DataVersion.indexOf(state[chatId].EventVersion) === 0 && state[chatId].DataStatus == state[chatId].EventStatus){
    //                                         bot.sendMessage(chatId, "งานตรวจสอบถูกต้องแล้ว", {"reply_markup": removeKeyBoard});
    //                                         state[chatId].state = "Finish";
    //                                     }
    //                                 }
    //                                 else{
    //                                     bot.sendMessage(chatId, "ไม่พบงาน", {"reply_markup": removeKeyBoard});
    //                                     state[chatId].state = "Finish";                            }
    //                             }).catch(err => console.log(err));
    //                         }
    //                         else{
    //                             bot.sendMessage(chatId, "ไม่พบงาน", {"reply_markup": removeKeyBoard});
    //                             state[chatId].state = "Finish";
    //                         }
    //                     }).catch(err => console.log(err));
    //                 }
    //             }
    //             else{
    //                 bot.sendMessage(chatId, "กรุณากรอก IdentityKeyTime ให้ถูกต้อง(eg.3091112131567160_OAOUY)", {"reply_markup": {"force_reply" : true, "resize_keyboard" : true}});
    //             }
    //         }
    //         else{
    //             bot.sendMessage(chatId, "กรุณากรอก IdentityKeyTime ให้ถูกต้อง(eg.3091112131567160_OAOUY)", {"reply_markup": {"force_reply" : true, "resize_keyboard" : true}});
    //         }
    //     }
    //     else if (state[chatId].state === "fixOperatorEvent"){
    //         if(text.indexOf("ใช่") === 0){
    //             bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //             disrupt.commitWorkOperator(capitalizeFirstLetter(state[chatId].whiteLabel), (state[chatId].Department).toLowerCase()
    //             , state[chatId].IdentityKeyTime, state[chatId].DataStatus).then(res => {
    //                 if(res['resultCode'] == 200) bot.sendMessage(chatId, 'แก้ไขเสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
    //                 else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //             }).catch(err => console.log(err));
    //             state[chatId].state = "Finish";
    //         }
    //         else if(text.indexOf("ไม่") === 0) {
    //             state[chatId].Department = "Finish";
    //             bot.sendMessage(chatId, "เสร็จสิ้น", {"reply_markup": removeKeyBoard});
    //         }
    //     }
    //     else if (state[chatId].state === "fixBankerEvent"){
    //         if(text.indexOf("ใช่") === 0){
    //             bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //             disrupt.commitWorkBanker(capitalizeFirstLetter(state[chatId].whiteLabel), (state[chatId].Department).toLowerCase()
    //             , state[chatId].TaskIdentityKeyTime, state[chatId].IdentityKeyTime, state[chatId].DataStatus).then(res => {
    //                 if(res['resultCode'] == 200) bot.sendMessage(chatId, 'แก้ไขเสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
    //                 else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //             }).catch(err => console.log(err));
    //             state[chatId].state = "Finish";
    //         }
    //         else if(text.indexOf("ไม่") === 0) {
    //             state[chatId].Department = "Finish";
    //             bot.sendMessage(chatId, "เสร็จสิ้น", {"reply_markup": removeKeyBoard});
    //         }
    //     }
    //     else if (state[chatId].state === "fixUpdaterEvent"){
    //         if(text.indexOf("ใช่") === 0){
    //             bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //             disrupt.commitWorkUpdater(capitalizeFirstLetter(state[chatId].whiteLabel), (state[chatId].Department).toLowerCase()
    //             , state[chatId].TaskIdentityKeyTime, state[chatId].IdentityKeyTime, state[chatId].DataStatus).then(res => {
    //                 if(res['resultCode'] == 200) bot.sendMessage(chatId, 'แก้ไขเสร็จเรียบร้อย', {"reply_markup": removeKeyBoard});
    //                 else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //             }).catch(err => console.log(err));
    //             state[chatId].state = "Finish";
    //         }
    //         else if(text.indexOf("ไม่") === 0) {
    //             state[chatId].Department = "Finish";
    //             bot.sendMessage(chatId, "เสร็จสิ้น", {"reply_markup": removeKeyBoard});
    //         }
    //     }
    //     //#endregion
    //     //#endregion

    //     //#region Queue Management Command
    //     else if (state[chatId].state === "QueueManagement"){
    //         if(text.indexOf("ต้องการทราบจำนวนคิวที่กำหนด") === 0) state[chatId].state = "GetQueueByType";
    //         else if(text.indexOf("จัดการคิวสเตท") === 0) state[chatId].state = "StartQueueByType";
    //         else if(text.indexOf("เคลียร์คิว") === 0) state[chatId].state = "ClearQueueByType";
    //         else if(text.indexOf("คิวสเตท") === 0) state[chatId].state = "GetQueueStateByType";
    //         else if(text.indexOf("แสดงคิวสเตททั้งหมด") === 0) state[chatId].state = "GetAllQueueStateByType";
    //         bot.sendMessage(chatId, "เลือกแผนก Department", {"reply_markup": {"keyboard": worktype, "resize_keyboard" : true}});
    //     }
    //     //#region GetQueueSize
    //     else if (state[chatId].state === "GetQueueByType"){
    //         state[chatId].WorkType = text.toLowerCase();
    //         state[chatId].state = "QueueNameSize";
    //         bot.sendMessage(chatId, "ระบุชื่อคิว(eg.Grey_Operator_Storage)", {"reply_markup": {"force_reply" : true, "resize_keyboard" : true}});
    //     }
    //     else if (state[chatId].state === "QueueNameSize"){
    //         console.log("WorkType is => " + state[chatId].WorkType);
    //         if(state[chatId].WorkType == "taskstorage"){
    //             bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //             disrupt.GetTaskStorageQueueSize(text).then(res => {
    //                 if(res['resultCode'] == 200) bot.sendMessage(chatId, 'QueueSize => ' + res['contract']['queueSize'], {"reply_markup": removeKeyBoard});
    //                 else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //             }).catch(err => console.log(err));
    //             state[chatId].state = "Finish";
    //         }
    //         else{
    //             bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //             disrupt.GetQueueSize(state[chatId].WorkType, text).then(res => {
    //                 if(res['resultCode'] == 200) bot.sendMessage(chatId, 'QueueSize => ' + res['contract']['queueSize'], {"reply_markup": removeKeyBoard});
    //                 else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //             }).catch(err => console.log(err));
    //             state[chatId].state = "Finish";
    //         }
    //     }
    //     //#endregion

    //     //#region  Start Queue
    //     else if (state[chatId].state === "StartQueueByType"){
    //         state[chatId].WorkType = text.toLowerCase();
    //         state[chatId].state = "StateQueueChoose";
    //         bot.sendMessage(chatId, "เลือกสถานะ", {"reply_markup": {"keyboard": queueState, "resize_keyboard" : true}});
    //     }
    //     else if (state[chatId].state === "StateQueueChoose"){
    //         state[chatId].QueueState = text.toLowerCase();
    //         state[chatId].state = "StartQueueName";
    //         bot.sendMessage(chatId, "ระบุชื่อคิว(eg.Grey_Operator_Storage)", {"reply_markup": {"force_reply" : true, "resize_keyboard" : true}});
    //     }
    //     else if (state[chatId].state === "StartQueueName"){
    //         if(state[chatId].WorkType == "taskstorage"){
    //             bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //             disrupt.StartTaskStorageQueue(text, state[chatId].QueueState).then(res => {
    //                 if(res['resultCode'] == 200 && state[chatId].QueueState == "process") bot.sendMessage(chatId, res['contract']['message'], {"reply_markup": removeKeyBoard});
    //                 else if(res['resultCode'] == 200 && state[chatId].QueueState == "sleep") bot.sendMessage(chatId, "Sleep Queue Success", {"reply_markup": removeKeyBoard});
    //                 else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //             }).catch(err => console.log(err));
    //             state[chatId].state = "Finish";
    //         }else{
    //             bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //             disrupt.StartQueue(state[chatId].WorkType, text, state[chatId].QueueState).then(res => {
    //                 if(res['resultCode'] == 200) bot.sendMessage(chatId, res['contract']['message'], {"reply_markup": removeKeyBoard});
    //                 else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //             }).catch(err => console.log(err));
    //             state[chatId].state = "Finish";
    //         }
    //     }
    //     //#endregion

    //     //#region Clear Queue
    //     else if (state[chatId].state === "ClearQueueByType"){
    //         state[chatId].WorkType = text.toLowerCase();
    //         state[chatId].state = "ClearQueueName";
    //         bot.sendMessage(chatId, "ระบุชื่อคิว(eg.Grey_Operator_Storage)", {"reply_markup": {"force_reply" : true, "resize_keyboard" : true}});
    //     }
    //     else if (state[chatId].state === "ClearQueueName"){
    //         if(state[chatId].WorkType == "taskstorage"){
    //             bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //             disrupt.ClearTaskStorageQueue(text).then(res => {
    //                 if(res['resultCode'] == 200) bot.sendMessage(chatId, res['contract']['message'], {"reply_markup": removeKeyBoard});
    //                 else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //             }).catch(err => console.log(err));
    //             state[chatId].state = "Finish";
    //         }
    //         else{
    //             bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //             disrupt.ClearQueue(state[chatId].WorkType, text).then(res => {
    //                 if(res['resultCode'] == 200) bot.sendMessage(chatId, res['contract']['message'], {"reply_markup": removeKeyBoard});
    //                 else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //             }).catch(err => console.log(err));
    //             state[chatId].state = "Finish";
    //         }
    //     }
    //     //#endregion

    //     //#region Get QueueState by Name
    //     else if (state[chatId].state === "GetQueueStateByType"){
    //         state[chatId].WorkType = text.toLowerCase();
    //         state[chatId].state = "QueueStateName";
    //         bot.sendMessage(chatId, "ระบุชื่อคิว(eg.Grey_Operator_Storage)", {"reply_markup": {"force_reply" : true, "resize_keyboard" : true}});
    //     }
    //     else if (state[chatId].state === "QueueStateName"){
    //         if(state[chatId].WorkType == "taskstorage"){
    //             bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //             disrupt.GetTaskStorageQueueState(text).then(res => {
    //                 if(res['resultCode'] == 200) bot.sendMessage(chatId, res['contract']['queueState'], {"reply_markup": removeKeyBoard});
    //                 else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //             }).catch(err => console.log(err));
    //             state[chatId].state = "Finish";
    //         }else{
    //             bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //             disrupt.GetQueueState(state[chatId].WorkType, text).then(res => {
    //                 if(res['resultCode'] == 200) bot.sendMessage(chatId, res['contract']['queueState'], {"reply_markup": removeKeyBoard});
    //                 else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //             }).catch(err => console.log(err));
    //             state[chatId].state = "Finish";
    //         }
    //     }
    //     //#endregion

    //     //#region Get All QueueState
    //     else if (state[chatId].state === "GetAllQueueStateByType"){
    //         if(text == "TaskStorage"){
    //             bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //             disrupt.GetAllTaskStorageQueueState("").then(res => {
    //                 if(res['resultCode'] == 200) bot.sendMessage(chatId, res['contract']['queueState'], {"reply_markup": removeKeyBoard});
    //                 else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //             }).catch(err => console.log(err));
    //             state[chatId].state = "Finish";
    //         }
    //         else{
    //             bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //             disrupt.GetAllQueueState(text.toLowerCase(), "").then(res => {
    //                 if(res['resultCode'] == 200) bot.sendMessage(chatId, res['contract']['queueState'], {"reply_markup": removeKeyBoard});
    //                 else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //             }).catch(err => console.log(err));
    //             state[chatId].state = "Finish";
    //         }
    //     }
    //     //#endregion
    //     //#endregion

    //     //#region  Security ManageMent Command
    //     else if (state[chatId].state === "SecurityManagement"){
    //         if(text.indexOf("แสดงรายชื่อคนที่ไม่ได้ยืนยันเครื่อง") === 0){
    //             bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //             disrupt.getInvalidateComputer(capitalizeFirstLetter(state[chatId].whiteLabel)).then(res => {
    //                 if(res['resultCode'] == 200){
    //                     res.contract.userInvalidateComputerContract.map(c => bot.sendMessage(chatId, `${c.username}, ${c.computerName} => ${c.securityCode}\n`
    //                     , {"reply_markup": removeKeyBoard}));
    //                 }
    //                 else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //                 state[chatId].state = "Finish";
    //             }).catch(err => console.log(err));
    //         }
    //         else if(text.indexOf("ติดตั้ง Cert") === 0) {
    //             state[chatId].state = "InstallCert";
    //             bot.sendMessage(chatId, "ระบุ Install Code(eg.aBcd)", {"reply_markup": {"force_reply" : true, "resize_keyboard" : true}});
    //         }
    //     }
    //     else if (state[chatId].state === "InstallCert"){
    //         bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //         disrupt.installCert(capitalizeFirstLetter(state[chatId].whiteLabel), text).then(res => {
    //             if(res['resultCode'] == 200) bot.sendMessage(chatId, "ติดตั้ง Certificate เสร็จสิ้น", {"reply_markup": removeKeyBoard});
    //             else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //             state[chatId].state = "Finish";
    //         }).catch(err => console.log(err));
    //     }
    //     //#endregion

    //     //#region AccountingManagement Command
    //     else if (state[chatId].state === "BankAccountManagement"){
    //         accountingCommands.length = 0;
    //         if (text.indexOf("แสดงรายละเอียดของบัญชีธนาคาร") === 0) {
    //             state[chatId].state = "DetailAccountManagement";
    //             bot.sendMessage(chatId, "เลือกคำสั่ง", {"reply_markup": {"keyboard": detailBankCommands, "resize_keyboard" : true}});
    //         }
    //         else if (text.indexOf("ตรวจสอบความถูกต้องของบัญชีธนาคาร") === 0) {
    //             state[chatId].state = "CheckingAccountManagement";
    //             bot.sendMessage(chatId, "เลือกคำสั่ง", {"reply_markup": {"keyboard": checkingBankCommands, "resize_keyboard" : true}});
    //         }
    //     }
    //     else if (state[chatId].state === "DetailAccountManagement"){
    //         state[chatId].CheckingMethod = "CheckConsistensy";
    //         if (text.indexOf("แสดงรายละเอียดของบัญชีธนาคารที่กำหนด") === 0) {
    //             bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //             disrupt.getBankList(capitalizeFirstLetter(state[chatId].whiteLabel)).then(res => {
    //                 if(res['resultCode'] == 200){
    //                     grouped = groupBy(res['contract']['bankList'], accountName => accountName.accountName);
    //                     var iterator1 = grouped.keys();
    //                     for(var i = 0; i < grouped.size ; i++){
    //                         accountingCommands.push(new Array(iterator1.next().value));
    //                     }
    //                     state[chatId].state = "AccountRetrieved";
    //                     bot.sendMessage(chatId, "เลือกชื่อบัญชี", {"reply_markup": {"keyboard": accountingCommands, "resize_keyboard" : true}});
    //                 }
    //                 else {
    //                     bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //                     state[chatId].state = "Finish";
    //                 }
    //             }).catch(err => console.log(err));
    //         }
    //         else if (text.indexOf("แสดงรายละเอียดของบัญชีธนาคารทั้งหมด") === 0) {
    //             bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //             disrupt.checkAllBankConsistensy(capitalizeFirstLetter(state[chatId].whiteLabel)).then(res => {
    //                 if(res['resultCode'] == 200){
    //                     res['contract']['accountingResultContract'].forEach(element => {
    //                         bot.sendMessage(chatId, `${element['bankName']}\n${element['deposits']}\n${element['withdraws']}\n${element['extraDeposits']}\n${element['extraWithdraws']}\n${element['extraExpenses']}\n`, {"reply_markup": removeKeyBoard});
    //                     });
    //                     bot.sendMessage(chatId, "เสร็จสิ้นการแสดงรายการทั้งหมด", {"reply_markup": removeKeyBoard});
    //                 }
    //                 else {
    //                     bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //                 }
    //                 state[chatId].state = "Finish";
    //             }).catch(err => console.log(err));
    //         }
    //     }
    //     else if (state[chatId].state === "CheckingAccountManagement"){
    //         state[chatId].state = "ChooseCheckingMethodManagement";
    //         state[chatId].CheckingMethod = text;
    //         bot.sendMessage(chatId, "เลือกคำสั่ง", {"reply_markup": {"keyboard": checkingBankContCommands, "resize_keyboard" : true}});
    //     }
    //     else if (state[chatId].state === "ChooseCheckingMethodManagement"){
    //         if (text.indexOf("แสดงรายละเอียดของบัญชีธนาคารที่กำหนด") === 0){
    //             bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //             disrupt.getBankList(capitalizeFirstLetter(state[chatId].whiteLabel)).then(res => {
    //                 if(res['resultCode'] == 200){
    //                     grouped = groupBy(res['contract']['bankList'], accountName => accountName.accountName);
    //                     var iterator1 = grouped.keys();
    //                     for(var i = 0; i < grouped.size ; i++){
    //                         accountingCommands.push(new Array(iterator1.next().value));
    //                     }
    //                     state[chatId].state = "AccountRetrieved";
    //                     bot.sendMessage(chatId, "เลือกชื่อบัญชี", {"reply_markup": {"keyboard": accountingCommands, "resize_keyboard" : true}});
    //                 }
    //                 else {
    //                     bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //                     state[chatId].state = "Finish";
    //                 }
    //             }).catch(err => console.log(err));
    //         }
    //         else if (text.indexOf("แสดงรายละเอียดของบัญชีธนาคารทั้งหมด") === 0){
    //             bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //             disrupt.getBankList(capitalizeFirstLetter(state[chatId].whiteLabel)).then(res => {
    //                 if(res['resultCode'] == 200){
    //                     bankListGrouped = groupBy(res['contract']['bankList'], rowKey => rowKey.rowKey);
    //                     var iterator1 = bankListGrouped.keys();
    //                     for(var i = 0; i < bankListGrouped.size ; i++){
    //                         //console.log(iterator1.next().value);
    //                         disrupt.checkMissing(capitalizeFirstLetter(state[chatId].whiteLabel), iterator1.next().value, false).then(res => {
    //                             var tempBank;
    //                             // console.log(JSON.stringify(res));
    //                             // console.log(res['contract']);
    //                             // console.log(res['contract']['bankName']);
    //                             // tempBank = bankListGrouped.get(res['contract']['bankName'])[0];
    //                             // console.log(tempBank['accountName']);
    //                             // console.log(tempBank['accountNumber']);
    //                             // console.log(tempBank['bankTemplateId']);
    //                             // console.log(bankListGrouped.get(res['contract']['bankName'])[0]['accountName']);
    //                             // console.log(bankListGrouped.get(res['contract']['bankName'])[0]['accountNumber']);
    //                             // console.log(bankListGrouped.get(res['contract']['bankName'])[0]['bankTemplateId']);

    //                             // console.log(bankListGrouped.get(res['contract']['bankName'])[0]['accountNumber']);
    //                             // console.log(bankListGrouped.get(res['contract']['bankName'])[0]['accountTemplate']);
    //                             if(res['resultCode'] == 200){
    //                                 tempBank = bankListGrouped.get(res['contract']['bankName'])[0];
                                    
    //                                 bot.sendMessage(chatId,tempBank['accountName'] +" " +tempBank['bankTemplateId'].split('-')[1]+"_"+tempBank['accountNumber']+"=> " + res['description'], {"reply_markup": removeKeyBoard});
    //                             }else{
    //                                 bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //                             }
    //                         }).catch(err => console.log(err));
    //                     }
    //                     //console.log(bankListGrouped);
    //                     //console.log(bankListGrouped.get('3090698500279790')[0]['accountName']);
    //                 }
    //                 else {
    //                     bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //                     state[chatId].state = "Finish";
    //                 }

    //             }).catch(err => console.log(err));
    //         }


    //         // if (state[chatId].CheckingMethod.indexOf("ตรวจสอบรายการที่สูญหาย") === 0){
    //         //     console.log("หาย");
    //         //     bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //         //     disrupt.checkMissing(capitalizeFirstLetter(state[chatId].whiteLabel), "3092677666365260", false).then(res => {
    //         //         console.log(JSON.stringify(res));
    //         //     }).catch(err => console.log(err));
    //         // }
    //         // else if (state[chatId].CheckingMethod.indexOf("ตรวจสอบรายการที่เกิน") === 0){
    //         //     console.log("เกิน");
    //         //     bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //         //     disrupt.checkOver(capitalizeFirstLetter(state[chatId].whiteLabel), "3092677666365260", false).then(res => {
    //         //         console.log(JSON.stringify(res));
    //         //     }).catch(err => console.log(err));
    //         // }
    //         // else if (state[chatId].CheckingMethod.indexOf("ตรวจสอบรายการซ้ำกัน") === 0){
    //         //     console.log("ซ้ำ");
    //         //     bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //         //     disrupt.checkDuplicate(capitalizeFirstLetter(state[chatId].whiteLabel), "3092677666365260", false).then(res => {
    //         //         console.log(JSON.stringify(res));
    //         //     }).catch(err => console.log(err));
    //         // }



    //         // if (text.indexOf("แสดงรายละเอียดของบัญชีธนาคารที่กำหนด") === 0){
    //         //     bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //         //     disrupt.getBankList(capitalizeFirstLetter(state[chatId].whiteLabel)).then(res => {
    //         //         console.log(JSON.stringify(res));
    //         //     }).catch(err => console.log(err));
    //         // }
    //         // else if (text.indexOf("แสดงรายละเอียดของบัญชีธนาคารทั้งหมด") === 0){
    //         //     bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //         //     disrupt.getBankList(capitalizeFirstLetter(state[chatId].whiteLabel)).then(res => {
    //         //         console.log(JSON.stringify(res));
    //         //     }).catch(err => console.log(err));
    //         // }
    //     }
    //     else if (state[chatId].state === "AccountRetrieved"){
    //         bankAccountCommands.length = 0;
    //         grouped.get(text).forEach(element => {
    //             bankAccountCommands.push(new Array(element['bankTemplateId'].split('-')[1] + "_" + element['accountNumber']));
    //             bankAccountGrouped.set(element['bankTemplateId'].split('-')[1] + "_" + element['accountNumber'], element['rowKey']);
    //         });
    //         state[chatId].state = "ChooseAccounting";
    //         bot.sendMessage(chatId, "เลือกบัญชี", {"reply_markup": {"keyboard": bankAccountCommands, "resize_keyboard" : true}});
    //     }
    //     else if (state[chatId].state === "ChooseAccounting"){
    //         bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //         state[chatId].BankAccountKeyTime = bankAccountGrouped.get(text);
    //         if (state[chatId].CheckingMethod.indexOf("ตรวจสอบรายการที่สูญหาย") === 0){
    //             disrupt.checkMissing(capitalizeFirstLetter(state[chatId].whiteLabel), bankAccountGrouped.get(text), false).then(res => {
    //                 console.log(res);
    //                 if(res['message'].indexOf("missing") === 0){
    //                     bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //                     bot.sendMessage(chatId, "ต้องการแก้ไขหรือไม่", {"reply_markup": {"keyboard": confirm, "resize_keyboard" : true}});
    //                     state[chatId].state = "ExecuteFixAccount";
    //                 }else{
    //                     bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //                     state[chatId].state = "Finish";
    //                 }
    //             }).catch(err => console.log(err));
    //         }
    //         else if (state[chatId].CheckingMethod.indexOf("ตรวจสอบรายการที่เกิน") === 0){
    //             disrupt.checkOver(capitalizeFirstLetter(state[chatId].whiteLabel), bankAccountGrouped.get(text), false).then(res => {
    //                 if(res['message'].indexOf("over") === 0){
    //                     bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //                     bot.sendMessage(chatId, "ต้องการแก้ไขหรือไม่", {"reply_markup": {"keyboard": confirm, "resize_keyboard" : true}});
    //                     state[chatId].state = "ExecuteFixAccount";
    //                 }else{
    //                     bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //                     state[chatId].state = "Finish";
    //                 }
    //             }).catch(err => console.log(err));
    //         }
    //         else if (state[chatId].CheckingMethod.indexOf("ตรวจสอบรายการซ้ำกัน") === 0){
    //             disrupt.checkDuplicate(capitalizeFirstLetter(state[chatId].whiteLabel), bankAccountGrouped.get(text), false).then(res => {
    //                 if(res['message'].indexOf("duplicate") === 0){
    //                     bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //                     bot.sendMessage(chatId, "ต้องการแก้ไขหรือไม่", {"reply_markup": {"keyboard": confirm, "resize_keyboard" : true}});
    //                     state[chatId].state = "ExecuteFixAccount";
    //                 }else{
    //                     bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //                     state[chatId].state = "Finish";
    //                 }
    //             }).catch(err => console.log(err));
    //         }
    //         else if (state[chatId].CheckingMethod.indexOf("CheckConsistensy") === 0){
    //             disrupt.checkConsistensy(capitalizeFirstLetter(state[chatId].whiteLabel), bankAccountGrouped.get(text)).then(res => {
    //                 if(res['resultCode'] == 200){
    //                     bot.sendMessage(chatId, `${res['contract']['deposits']}\n${res['contract']['withdraws']}\n${res['contract']['extraDeposits']}\n${res['contract']['extraWithdraws']}\n${res['contract']['extraExpenses']}\n`, {"reply_markup": removeKeyBoard});
    //                 }
    //                 else bot.sendMessage(chatId, res['description'], {"reply_markup": removeKeyBoard});
    //                 state[chatId].state = "Finish";
    //             }).catch(err => console.log(err));
    //         }
    //     }
    //     else if (state[chatId].state === "ExecuteFixAccount"){
    //         bot.sendMessage(chatId, "กรุณารอสักครู่", {"reply_markup": removeKeyBoard});
    //         if (text.indexOf("ใช่") === 0){
    //             if (state[chatId].CheckingMethod.indexOf("ตรวจสอบรายการที่สูญหาย") === 0){
    //                 disrupt.checkMissing(capitalizeFirstLetter(state[chatId].whiteLabel), state[chatId].BankAccountKeyTime, true).then(res => {
    //                     bot.sendMessage(chatId, res['message'], {"reply_markup": removeKeyBoard});
    //                     state[chatId].state = "Finish";
    //                 }).catch(err => console.log(err));
    //             }
    //             else if (state[chatId].CheckingMethod.indexOf("ตรวจสอบรายการที่เกิน") === 0){
    //                 disrupt.checkOver(capitalizeFirstLetter(state[chatId].whiteLabel), state[chatId].BankAccountKeyTime, true).then(res => {
    //                     bot.sendMessage(chatId, res['message'], {"reply_markup": removeKeyBoard});
    //                     state[chatId].state = "Finish";
    //                 }).catch(err => console.log(err));
    //             }
    //             else if (state[chatId].CheckingMethod.indexOf("ตรวจสอบรายการซ้ำกัน") === 0){
    //                 disrupt.checkDuplicate(capitalizeFirstLetter(state[chatId].whiteLabel), state[chatId].BankAccountKeyTime, true).then(res => {
    //                     bot.sendMessage(chatId, res['message'], {"reply_markup": removeKeyBoard});
    //                     state[chatId].state = "Finish";
    //                 }).catch(err => console.log(err));
    //             }
    //         }
    //         else{
    //             bot.sendMessage(chatId, "เสร็จสิ้น", {"reply_markup": removeKeyBoard});
    //             state[chatId].state = "Finish";
    //         }
    //     }
    //     //#endregion
    // }
});

var getProperty = function (propertyName) {
    return obj[propertyName];
};

function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
         const key = keyGetter(item);
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });
    return map;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}