var admin = require("firebase-admin");

let privateKey;

if( process.env.PRIVATE_KEY ){
    privateKey = JSON.parse(process.env.PRIVATE_KEY)
} else{
    privateKey = require('./secrets/secret.json')
}

function connect() {
    admin.initializeApp({
    credential: admin.credential.cert(privateKey)
    });

    const db = admin.firestore()
    return db

}

module.exports = {connect}


