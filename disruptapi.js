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