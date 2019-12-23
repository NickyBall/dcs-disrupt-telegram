const superagent = require('superagent');
var dotenv = require('dotenv');
dotenv.config();
const endpoint = process.env.BASE_URL;
// const endpoint = 'https://dcs-production.southeastasia.cloudapp.azure.com:8817/';

function GetToken() {
    return new Promise((resolve, reject) => {
        superagent.post(endpoint +'connect/token')
                    .send({
                            client_id: process.env.CLIENT_ID,
                            client_secret: process.env.CLIENT_SECRET,
                            grant_type: "client_credentials"
                            }) // sends a JSON post body
            .set('accept', 'json')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .then(res => resolve(res.body.access_token))
            .catch(err => reject(err));
    });
}

module.exports.dataOps = (whiteLabelName, syncName) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/dataops/syncdictionary')
                        .send({
                            ListenerName: whiteLabelName,
                            SyncName: syncName
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.createUser = (whiteLabelName, userType, username, password) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/useronline/createBot')
                        .send({
                            ListenerName: whiteLabelName,
                            UserType: userType,
                            Username: username,
                            Password: password
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.clearUserOnline = (whiteLabelName) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/useronline/clear')
                        .send({
                            ListenerName: whiteLabelName
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.topupCredit = (whiteLabelName, amount) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/credit/topup')
                        .send({
                            ListenerName: whiteLabelName,
                            Amount: amount
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.createBlobByWeekKeyTime = (whiteLabelName, weekKeyTime) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/blob/create/week')
                        .send({
                            ListenerName: whiteLabelName,
                            WeekKeyTime: weekKeyTime
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.createBlobByPartition = (department, whiteLabelName, weekKeyTime, partition, accountingpattern) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/blob/create/partition')
                        .send({
                            Departure: department,
                            ListenerName: whiteLabelName,
                            WeekKeyTime: weekKeyTime,
                            Partition: partition,
                            AccountingPattern: accountingpattern
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.deleteWorkByTaskIdentityKeyTime = (whiteLabelName, taskIdentityKeyTime) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/worktask/delete/workbytaskidentitykeytime')
                        .send({
                            ListenerName: whiteLabelName,
                            TaskIdentityKeyTime: taskIdentityKeyTime
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.deleteSpecificWork = (whiteLabelName, department, taskIdentityKeyTime, identityKeyTime) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/worktask/delete/workbyidentitykeytime')
                        .send({
                            ListenerName: whiteLabelName,
                            Department: department,
                            TaskIdentityKeyTime: taskIdentityKeyTime,
                            IdentityKeyTime: identityKeyTime
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.commitWorkOperator = (whiteLabelName, department, identityKeyTime, commitStatus) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/worktask/commit/workbyidentitykeytime')
                        .send({
                            ListenerName: whiteLabelName,
                            Department: department,
                            IdentityKeyTime: identityKeyTime,
                            CommitStatus: commitStatus
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.commitWorkBanker = (whiteLabelName, department, taskIdentityKeyTime, identityKeyTime, commitStatus, oldBalance, newBalance) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/worktask/commit/workbyidentitykeytime')
                        .send({
                            ListenerName: whiteLabelName,
                            Department: department,
                            TaskIdentityKeyTime: taskIdentityKeyTime,
                            IdentityKeyTime: identityKeyTime,
                            CommitStatus: commitStatus,
                            BankerOldBalance: oldBalance,
                            BankerNewBalance: newBalance,
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.commitWorkUpdater = (whiteLabelName, department, taskIdentityKeyTime, identityKeyTime, commitStatus, oldBalance, newBalance, oldCredit, newCredit) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/worktask/commit/workbyidentitykeytime')
                        .send({
                            ListenerName: whiteLabelName,
                            Department: department,
                            TaskIdentityKeyTime: taskIdentityKeyTime,
                            IdentityKeyTime: identityKeyTime,
                            CommitStatus: commitStatus,
                            UpdaterOldBalance: oldBalance,
                            UpdaterNewBalance: newBalance,
                            UpdaterOldCredit: oldCredit,
                            UpdaterNewCredit: newCredit
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};


module.exports.completeSpecificWorkOperator = (whiteLabelName, department, identityKeyTime, commitStatus) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/worktask/commit/workbyidentitykeytime')
                        .send({
                            ListenerName: whiteLabelName,
                            Department: department,
                            IdentityKeyTime: identityKeyTime,
                            CommitStatus: commitStatus
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.completeSpecificWorkBanker = (whiteLabelName, department, taskIdentityKeyTime, identityKeyTime, oldBalance, newBalance) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/worktask/commit/workbyidentitykeytime')
                        .send({
                            ListenerName: whiteLabelName,
                            Department: department,
                            TaskIdentityKeyTime: taskIdentityKeyTime,
                            IdentityKeyTime: identityKeyTime,
                            BankerOldBalance: oldBalance,
                            BankerNewBalance: newBalance,
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.completeSpecificWorkUpdater = (whiteLabelName, department, taskIdentityKeyTime, identityKeyTime, oldBalance, newBalance, oldCredit, newCredit) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/worktask/commit/workbyidentitykeytime')
                        .send({
                            ListenerName: whiteLabelName,
                            Department: department,
                            TaskIdentityKeyTime: taskIdentityKeyTime,
                            IdentityKeyTime: identityKeyTime,
                            UpdaterOldBalance: oldBalance,
                            UpdaterNewBalance: newBalance,
                            UpdaterOldCredit: oldCredit,
                            UpdaterNewCredit: newCredit
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.retrieveOperator = (whiteLabelName, taskIdentityKeyTime) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/worktask/retrieve/operator')
                        .send({
                            ListenerName: whiteLabelName,
                            TaskIdentityKeyTime: taskIdentityKeyTime,
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.retrieveOperatorEvent = (whiteLabelName, identityKeyTime) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/worktask/retrieve/operatorevent')
                        .send({
                            ListenerName: whiteLabelName,
                            IdentityKeyTime: identityKeyTime,
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.retrieveBanker = (whiteLabelName, taskIdentityKeyTime, IdentityKeyTime) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/worktask/retrieve/banker')
                        .send({
                            ListenerName: whiteLabelName,
                            TaskIdentityKeyTime: taskIdentityKeyTime,
                            IdentityKeyTime: IdentityKeyTime
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.retrieveBankerEvent = (whiteLabelName, taskIdentityKeyTime, IdentityKeyTime) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/worktask/retrieve/bankerevent')
                        .send({
                            ListenerName: whiteLabelName,
                            TaskIdentityKeyTime: taskIdentityKeyTime,
                            IdentityKeyTime: IdentityKeyTime
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.retrieveUpdater = (whiteLabelName, taskIdentityKeyTime, IdentityKeyTime) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/worktask/retrieve/updater')
                        .send({
                            ListenerName: whiteLabelName,
                            TaskIdentityKeyTime: taskIdentityKeyTime,
                            IdentityKeyTime: IdentityKeyTime
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.retrieveUpdaterEvent = (whiteLabelName, taskIdentityKeyTime, IdentityKeyTime) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/worktask/retrieve/updaterevent')
                        .send({
                            ListenerName: whiteLabelName,
                            TaskIdentityKeyTime: taskIdentityKeyTime,
                            IdentityKeyTime: IdentityKeyTime
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.GetQueueSize = (workType, queueName) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/queue/getsize')
                        .send({
                            WorkType: workType,
                            QueueName: queueName
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.GetQueueThreadSize = (workType, queueName) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/queue/getthreadsize')
                        .send({
                            WorkType: workType,
                            QueueName: queueName
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.ReleaseSemaphore = (workType, queueName) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/queue/releasesemaphore')
                        .send({
                            WorkType: workType,
                            QueueName: queueName
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.GetTaskStorageQueueSize = (queueName) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/queue/gettaskstoragesize')
                        .send({QueueName: queueName}) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.StartQueue = (workType, queueName, inputState) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/queue/start')
                        .send({
                            WorkType: workType,
                            QueueName: queueName,
                            InputState: inputState
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.StartTaskStorageQueue = (queueName, inputState) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/queue/starttaskstorage')
                        .send({
                            QueueName: queueName,
                            InputState: inputState
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.ClearQueue = (workType, queueName) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/queue/clear')
                        .send({
                            WorkType: workType,
                            QueueName: queueName
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.ClearTaskStorageQueue = (queueName) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/queue/cleartaskstorage')
                        .send({
                            QueueName: queueName
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.GetQueueState = (workType, queueName) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/queue/getqueuestate')
                        .send({
                            WorkType: workType,
                            QueueName: queueName
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.GetTaskStorageQueueState = (queueName) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/queue/gettaskstoragequeuestate')
                        .send({
                            QueueName: queueName
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.GetAllQueueState = (workType, queueName) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/queue/getallqueuestate')
                        .send({
                            WorkType: workType,
                            QueueName: queueName
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.GetAllTaskStorageQueueState = (queueName) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/queue/getalltaskstoragequeuestate')
                        .send({
                            QueueName: queueName
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.getInvalidateComputer = (whiteLabelName) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/security/getinvalidatecomputer')
                        .send({
                            ListenerName: whiteLabelName
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => reject(err));
    });
};

module.exports.installCert = (whiteLabelName, installCode) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/security/installcert')
                        .send({
                            ListenerName: whiteLabelName,
                            SecurityCode: installCode
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => console.log(err));
    });
};

module.exports.checkConsistensy = (whiteLabelName, bankKeyTime) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/accounting/checkconsistency')
                        .send({
                            ListenerName: whiteLabelName,
                            BankKeyTime: bankKeyTime
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => console.log(err));
    });
};

module.exports.checkAllBankConsistensy = (whiteLabelName) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/accounting/checkallconsistency')
                        .send({
                            ListenerName: whiteLabelName
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => console.log(err));
    });
};

module.exports.getBankList = (whiteLabelName) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/accounting/getbanklist')
                        .send({
                            ListenerName: whiteLabelName
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => console.log(err));
    });
};

module.exports.checkMissing = (whiteLabelName, bankKeyTime, isExecute) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/accounting/checkmissing')
                        .send({
                            ListenerName: whiteLabelName,
                            BankKeyTime: bankKeyTime,
                            WithExecute: isExecute
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => console.log(err));
    });
};

module.exports.checkOver = (whiteLabelName, bankKeyTime, isExecute) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/accounting/checkover')
                        .send({
                            ListenerName: whiteLabelName,
                            BankKeyTime: bankKeyTime,
                            WithExecute: isExecute
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => console.log(err));
    });
};

module.exports.checkDuplicate = (whiteLabelName, bankKeyTime, isExecute) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/accounting/checkduplicate')
                        .send({
                            ListenerName: whiteLabelName,
                            BankKeyTime: bankKeyTime,
                            WithExecute: isExecute
                        }) // sends a JSON post body
                .set('accept', 'json')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${access_token}`)
                .then(res => resolve(res.body))
                .catch(err => reject(err));
        }).catch(err => console.log(err));
    });
};