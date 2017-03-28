# Fergg

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0-rc.2.

# Development server

If you have already installed Angular CLI, update it first:
 
Update the angular cli 
======================
% sudo npm uninstall -g angular-cli
% sudo npm cache clean
% sudo npm install -g angular-cli@latest


Install project dependencies

cd to your project and run:
% sudo npm install


Build local project

ng build --prod --aot


Run Locally

node server.js


# Run tests

ng test


# Email Functionality
Go to : https://www.google.com/settings/security/lesssecureapps set the Access for less secure apps setting to Enable

Update username and password in server.js


Firebase config

generate firebase config from https://console.firebase.google.com/

// firebase frontend configuration 

// See https://console.firebase.google.com/project/fergg-c183c/database/data to live view the data

 export const firebaseConfig = { apiKey: "xxxx","xxxx", authDomain: "xxxx", databaseURL: "https://shoppinglist-12407.firebaseio.com", storageBucket: "shoppinglist-12407.appspot.com", messagingSenderId: "xxxx", };

create firebase-secret.js in project directory and paste the firebase secret.
