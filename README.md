# Fergg

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.22-1.

### Deployed Webapp

App ausprobieren: https://fergg.karrer.net

Folgende Funktionen sollten funktionieren:
 - Einkaufsliste anlegen/löschen/bearbeiten/zurücksetzen/fertig
 - Mit der Suchfunktion ("Was willst du einkaufen") Artikel hinzufügen
 - Durch Öffnen der Rubriken (z.B. "Früchte und Gemüse") Artikel hinzufügen
 - "Rote" Artikel in der obersten Liste anklicken --> Detail- Ansicht
     - Artikel in den Einkaufswagen legen (wird grün)
     - Artikel löschen
     - Menge angeben (Stückzahl, kg usw.)
     - längere Beschreibung angeben
 - Durch Swipe nach rechts wird ein roter Artikel "grün", swipe nach links macht ihn wieder rot

Die Menufunktion "Katalog bearbeiten" funktioniert leider *nicht*.     - 
 

### Development server

If you have already installed Angular CLI, update it first:
 
### Update the angular cli

    % sudo npm uninstall -g angular-cli
    % sudo npm cache clean
    % sudo npm install -g angular-cli@latest

#### Install project dependencies

    % cd <your project directory>
    % sudo npm install

#### Build local project

    ng build --prod --aot

#### Run Locally

This runs the app on localhost:4200

    ng serve

#### Email Functionality

server.js is a small program that listens to changes in the firebase db that
require an email notification. To mail mail invitations work,
update smtp host, username and password in mail-secret.js, an then run:

    node server.js
    

#### Run tests

    ng test

#### Firebase config

generate firebase config from https://console.firebase.google.com/

// firebase frontend configuration

// See https://console.firebase.google.com/project/fergg-c183c/database/data to live view the data

 export const firebaseConfig = { apiKey: "xxxx","xxxx", authDomain: "xxxx", databaseURL: "https://shoppinglist-12407.firebaseio.com", storageBucket: "shoppinglist-12407.appspot.com", messagingSenderId: "xxxx", };

#### Firebase hosting

Initalize firebase as described in firebase.notes.md. Then deploy:

    $ firebase login             (needed only once)
    $ ng build --prod --aot
    $ firebase deploy
    
The URL of the deployed app is https://fergg-c183c.firebaseapp.com

#### fergg.karrer.net

There is now a dns entry https://fergg.karrer.net that points to the above.