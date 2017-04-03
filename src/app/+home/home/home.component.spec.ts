/* tslint:disable:no-unused-variable */

import {TestBed, async} from '@angular/core/testing';
import {HomeComponent} from './home.component';
import {UsersService} from './../../services/users.service';
import {
    AngularFire,
    FirebaseObjectObservable,
    FIREBASE_PROVIDERS,
    AngularFireAuth,
    FirebaseConfig,
    FirebaseApp,
    defaultFirebase,
    AngularFireDatabase,
    FirebaseAppConfig,
    AngularFireModule
} from 'angularfire2';

import {Subscription} from 'rxjs/Subscription';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '@angular/material';

import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {Observable} from 'rxjs/Rx';
import 'rxjs/Rx';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';

const APP_NAME = 'Fergg';

class DummyComponent {
}
class RouterStub {
}

describe('HomeComponent', () => {

    let subscription: Subscription;
    let app: firebase.app.App;
    let rootRef: firebase.database.Reference;
    let questionsRef: firebase.database.Reference;
    let listOfQuestionsRef: firebase.database.Reference;
    let PouchDB: any;
    let AppServiceStub = {
        PouchInstance: function () {
            return new PouchDB("sList");
        }
    };
    beforeEach((done) => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        setTimeout(function () {
            console.log('inside timeout');
            done();
        }, 50);
        TestBed.configureTestingModule({
            declarations: [
                HomeComponent
            ],
            imports: [MaterialModule,
                RouterTestingModule, TranslateModule.forRoot()
            ],
            providers: [{provide: UsersService, useValue: AppServiceStub}, {
                provide: UsersService,
                useValue: AppServiceStub
            }]
        });
        TestBed.compileComponents();
    });

    it('should create the app home', async(() => {
        let fixture = TestBed.createComponent(HomeComponent);
        let app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});
