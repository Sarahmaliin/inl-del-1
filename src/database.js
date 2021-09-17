var admin = require("firebase-admin");

var serviceAccount = require("./secrets/secret.json");

function connect() {
    admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
    });

    const db = admin.firestore()
    return db

}

module.exports = {connect}


