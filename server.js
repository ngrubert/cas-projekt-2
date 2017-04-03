"use strict";

var express = require('express');
var path = require('path');
var util = require('util');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var firebaseAdmin = require('firebase-admin');
var serviceAccount = require("./firebase-secret.js");
var mailAccount = require("./mail-secret.js");

var MAIL = {
    'en': {
        'subj': 'Fergg! New Shopping list "%s"',
        'text': 'A new shopping list "%s" has been created by %s: %s',
        'html': '<p>A new shopping list "%s" has been created by %s</p><a href="%s">Click here to see it.</a>'
    },
    'de': {
        'subj': 'Fergg! Neue Einkaufsliste "%s"',
        'text': 'Neue Einkaufsliste "%s" von %s: %s',
        'html': '<p>Neue Einkaufsliste "%s" von %s</p><a href="%s">Ansehen!</a>'
    }
};

// add middleware
app.use(express.static(path.join(__dirname, './dist')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//email code
var transporter = nodemailer.createTransport({
    host: mailAccount.smtpHost,
    port: 587,
    secure: false,
    auth: { user: mailAccount.smtpUser, pass: mailAccount.smtpPass }
});

var sList;


// firebase server initialization
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://fergg-c183c.firebaseio.com"
});


var listRef = firebaseAdmin.database().ref();

// sListUsers collection child_changed event send email
listRef.child('sListUsers').on('child_changed', function(dataSnapshot) {
    const msg = dataSnapshot.val();
    const key = dataSnapshot.key;

    firebaseAdmin.database().ref("sList/" + key).once('value').then(function(snap) {
        sList = snap.val();
        console.log("sList title = " + JSON.stringify(sList.title));
        console.log("sList siteUrl = " + JSON.stringify(sList.siteUrl));
    });

    for (var property in msg) {
        if (msg.hasOwnProperty(property)) {
            if(msg[property]) {
                msg[property] = false;
                queryEmail(key, property);
                // listRef.child('sListUsers').child(key).update(msg);
            }
        }
    }
    for (property in msg) {
        if (msg.hasOwnProperty(property)) {
            msg[property] = false;
            // queryEmail(property);
            listRef.child('sListUsers').child(key).update(msg);
        }
    }
});

// email id from user id
var queryEmail = function(key,property){
    listRef.child('users').orderByKey().equalTo(property).limitToLast(1).on("value", function(data) {
        var obj = data.val();
        if (obj) {
            sendEmail(key, property, obj[property].email)
        }
    });
};


// send email
var sendEmail = function(key, property, mailId) {
    var sendUrl = sList.siteUrl + "/#/list/" + key + ";email=" + property;
    var lang = sList.language;
    if (lang == "English") { lang = "en" }
    if (lang == "German" ) { lang = "de" }
    var FMT = MAIL[lang];
    var mailOptions = {
        from: mailAccount.fromUser,                                    // sender address
        to: mailId,                                                    // list of receivers
        subject: util.format(FMT.subj, sList.title),                   // Subject line
        text: util.format(FMT.text, sList.title, sList.name, sendUrl), // plaintext body
        html: util.format(FMT.html, sList.title, sList.name, sendUrl)  // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            return console.log('Error sending mail to ' + mailId + ': ' + error);
        }
        console.log('Mail sent to ' + mailId + ': ' + info.response);
    });
};


// verify connection configuration
transporter.verify(function(error, success) {
    if (error) {
        console.log('SMTP: user ' + mailAccount.smtpUser + ' at ' + mailAccount.smtpHost + ': ' + error);
    } else {
        console.log('SMTP: user ' + mailAccount.smtpUser + ' at ' + mailAccount.smtpHost + ' seems ok');
    }
});


// start the server
const port = 3000;
app.listen(process.env.PORT || port, function() {
    console.log('Server running at http://localhost:' + port);
});
