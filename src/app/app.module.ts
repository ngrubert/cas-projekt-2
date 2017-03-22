import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule, Http} from '@angular/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AngularFireModule} from 'angularfire2';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {MaterialModule} from '@angular/material';
import {HammerGestureConfig, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';


import {AppRoutingModule} from './app.routing';
import {IndexModule} from './index/index.module';
import {firebaseConfig} from './config/firebase-config';
import {UsersService} from './services/users.service';
import {AppComponent} from './app.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: Http) {
    return new TranslateHttpLoader(http);
}

// Configure Hammerjs so that we can use tap, swipeleft, swiperight but
// in a way that normal scrolling in the y direction still works.
// http://stackoverflow.com/questions/42424980/turn-off-hammer-js-events-in-angular-2-to-allow-scrolling
declare var Hammer: any;
export class MyHammerConfig extends HammerGestureConfig {
    buildHammer(element: HTMLElement) {
        let mc = new Hammer(element, {
            touchAction: "pan-y",
        });
        return mc;
    }
}

// app main bootstrap
@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [Http]
            }
        }),
        MaterialModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AppRoutingModule,
        IndexModule
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        {provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig},
        UsersService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
