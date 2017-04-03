/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { ClearComponent } from './clear.component';
import { FormsModule } from '@angular/forms';
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

import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Rx';
import { firebaseConfig } from './../config/firebase-config';
import { ClearService } from './clear.service';
import { UsersService } from './../services/users.service';
import 'rxjs/Rx';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

const APP_NAME = 'Fergg';

class DummyComponent {
}
class RouterStub {
}

describe('ClearComponent', () => {

  let subscription:Subscription;
  let app: firebase.app.App;
  let rootRef: firebase.database.Reference;
  let questionsRef: firebase.database.Reference;
  let listOfQuestionsRef: firebase.database.Reference;
  let angularFire2: AngularFire;
  let PouchDB: any;
  let document:any;
  let AppServiceStub = {
    PouchInstance:function(){
        return new PouchDB("sList");
    }
  };
  beforeEach((done) => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000000;
    setTimeout(function () {
            console.log('inside timeout');
            done();
        }, 100);
    TestBed.configureTestingModule({
      declarations: [
      ClearComponent
      ],
      imports: [
       RouterTestingModule,FormsModule,AngularFireModule.initializeApp(firebaseConfig), TranslateModule.forRoot()
      ],
      providers:[{provide: ClearService, useValue: AppServiceStub},{provide: UsersService, useValue: AppServiceStub}]
    });
    TestBed.compileComponents();
  });

  it('should create the app home', async(() => {
    let fixture = TestBed.createComponent(ClearComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  
});
