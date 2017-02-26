# Shoppinglist

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.22-1.

# UPGRADE

 - install nodejs 6.10.0
 - install angular-cli 1.0.0-rc.0
 
  Global package:

    $ npm uninstall -g angular-cli @angular/cli
    $ npm cache clean
    $ npm install -g @angular/cli@latest`
      
  Local project package:

    $ rm -rf node_modules dist # use rmdir on Windows
    $ npm install --save-dev @angular/cli@latest
    $ npm install

## Development server

Run `node server` to run the email server that listens to events from the firebase database.

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Deploying to Github Pages

Run `ng github-pages:deploy` to deploy to Github Pages.

## Further help

To get more help on the `angular-cli` use `ng --help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Firebase database

https://console.firebase.google.com/project/fergg-c183c/database/data?pli=1

Important files:
- src/firebase-secret.js
- src/app/config/firebase-config.ts

## Firebase hosting

Install firebase tools, login and initialize the firebase project:
 
    $ npm i -g firebase-tools
    $ firebase login
    $ firebase init
     - we're outside of our home dir
       proceed: Y
    
      (*) Database
     >(*) Hosting
    
    default project
    > Fergg! (fergg-c183c)
    
    ? What do you want to use as your public directoru (public) dist
    
    ? configure as a SPA (rewrite all urls to index.html)? N
    
    ? index.,html exists. Overwrite? N
    
     - skipping write of index.html
     - writing config info tofirebase.json
     - writing projetc infot to .firebaserc
    
     - initialization complete
    
## Firebase deploy

Make a build locally in ./dist:

    $ cd <top directory of project>
    $ ng build --prod
    chunk    {0} 0.0c98c5bc0a9d5b9c313b.chunk.js 333 kB {1} {2} {3} {4} {5} {6} {7} {8} {9} {10} [rendered]
    chunk    {1} 1.48105112e5b10e770836.chunk.js 205 kB {0} {2} {3} {4} {5} {6} {7} {8} {9} {10} [rendered]
    [...]
    chunk   {12} vendor.f81d7c654f3b1a97cadf.bundle.js (vendor) 3.49 MB [initial] [rendered]
    chunk   {13} inline.f3f65f8f74d285f485ac.bundle.js (inline) 0 bytes [entry] [rendered]
    
Deploy the dist folder to firebase hosting:
    
    $ firebase deploy
    === Deploying to 'fergg-c183c'...
    i  deploying database, hosting
    +  database: rules ready to deploy.
    i  hosting: preparing dist directory for upload...
    Uploading: [======================================= ] 97%+  hosting: dist folder uploaded successfully
    +  hosting: 37 files uploaded successfully
    i  starting release process (may take several minutes)...
    +  Deploy complete!
    Project Console: https://console.firebase.google.com/project/fergg-c183c/overview
    Hosting URL: https://fergg-c183c.firebaseapp.com
    
    
