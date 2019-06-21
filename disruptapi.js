const superagent = require('superagent');
const endpoint = 'https://dcs-staging.southeastasia.cloudapp.azure.com:8817/';
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

module.exports.completeSpecificWorkOperator = (whiteLabelName, department, taskIdentityKeyTime, identityKeyTime) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/worktask/complete/workbyidentitykeytime')
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

module.exports.completeSpecificWorkBanker = (whiteLabelName, department, taskIdentityKeyTime, identityKeyTime, oldBalance, newBalance) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/worktask/complete/workbyidentitykeytime')
                        .send({
                            ListenerName: whiteLabelName,
                            Department: department,
                            TaskIdentityKeyTime: taskIdentityKeyTime,
                            IdentityKeyTime: identityKeyTime,
                            OldBalance: oldBalance,
                            NewBalance: newBalance
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

module.exports.GetQueueSize = (workType, queueName) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post(endpoint + 'api/disrupt/queue/getsize')
                        .send({
                            WorkType: workType,
                            QueueName: queueName,
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