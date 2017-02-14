var express = require('express');
var path = require('path');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser')
var nodemailer = require('nodemailer');
var firebaseAdmin = require('firebase-admin');
var serviceAccount = require("./firebase-secret.js");


// add middleware
app.use(express.static(path.join(__dirname, './dist')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//email code
var transporter = nodemailer.createTransport('smtps://nicogrubert%40gmail.com:Test@smtp.gmail.com');
// @ Andi: if you have a gmail account, you can use the commented code to enable email sending; otherwise you will get an auth error "response: '535-5.7.8 Username and Password not accepted"
// var transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//         user: 'nicogrubert@gmail.com',
//         pass: 'my-secret-pass'
//     }
// });
var siteUrl;
var sendUrl;


// firebase server initialization
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://shoppinglist-12407.firebaseio.com"
});


var listRef = firebaseAdmin.database().ref();

// sListUsers collection child_changed event send email 
listRef.child('sListUsers').on('child_changed', function(dataSnapshot) { 
    const msg = dataSnapshot.val();
    const key = dataSnapshot.key;
    for (var property in msg) {
        if (msg.hasOwnProperty(property)) {
            if(msg[property]) {
                msg[property]=false;
                queryEmail(key,property);
                // listRef.child('sListUsers').child(key).update(msg);
            }
        }
    }
    for (var property in msg) {
        if (msg.hasOwnProperty(property)) {
            msg[property]=false;
            // queryEmail(property);
            listRef.child('sListUsers').child(key).update(msg);
        }
    }    
});

// email id from user id
var queryEmail = function(key,property){
    listRef.child('users').orderByKey().equalTo(property).limitToLast(1).on("value",function(data) {
        var obj =data.val();
        if (obj) {
            sendEmail(key,property, obj[property].email)
        }
    });
}


// send email
var sendEmail = function(key,property,mailId) {
    siteUrl = 'http://localhost:4200';
    sendUrl = siteUrl + "/#/list/" + key + ";email=" + property;
    var mailOptions = {
        from: 'nicogrubert@gmail.com', // sender address
        to: mailId, // list of receivers
        subject: 'New Shopping list', // Subject line
        text: 'A new shopping list has been created', // plaintext body
        html: '<p>A new shopping list has been created</p><a href='+sendUrl+'>Click here to see it.</a>' // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}


// start the server
const port = 3000;
app.listen(process.env.PORT || port, function() {
    console.log('Server running at http://localhost:' + port);
})
