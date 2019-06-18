const superagent = require('superagent');

function GetToken() {
    return new Promise((resolve, reject) => {
        superagent.post('https://dcs-staging.southeastasia.cloudapp.azure.com:8817/connect/token')
                    .send({
                            client_id: 'disrupt',
                            client_secret: 'disruptdcs888',
                            grant_type: "client_credentials"
                            }) // sends a JSON post body
            .set('accept', 'json')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .then(res => resolve(res.body.access_token))
            .catch(err => reject(err));
    });
}

module.exports.getInvalidateComputer = (whiteLabelName) => {
    return new Promise((resolve, reject) => {
        GetToken().then(access_token => {
            superagent.post('https://dcs-staging.southeastasia.cloudapp.azure.com:8817/api/disrupt/security/getinvalidatecomputer')
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
            superagent.post('https://dcs-staging.southeastasia.cloudapp.azure.com:8817/api/disrupt/security/installcert')
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
}