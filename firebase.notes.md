## Firebase config

generate firebase config from https://console.firebase.google.com/

// firebase frontend configuration

// See https://console.firebase.google.com/project/fergg-c183c/database/data to live view the data

 export const firebaseConfig = { apiKey: "xxxx","xxxx", authDomain: "xxxx", databaseURL: "https://shoppinglist-12407.firebaseio.com", storageBucket: "shoppinglist-12407.appspot.com", messagingSenderId: "xxxx", };

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


