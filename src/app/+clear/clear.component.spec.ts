/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import {ClearComponent } from './clear.component';
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
import {ClearService} from './clear.service';
 import 'rxjs/Rx';

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
      RouterTestingModule ,FormsModule,AngularFireModule.initializeApp(firebaseConfig)
      ],
      providers:[{provide: ClearService, useValue: AppServiceStub }]
    });
    TestBed.compileComponents();
  });

  it('should create the app home', async(() => {
    let fixture = TestBed.createComponent(ClearComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  

  // it(`should have as title 'app works!'`, async(() => {
  //   let fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   let app = fixture.debugElement.componentInstance;
  //   expect(app.title).toEqual('app works!');
  // }));

  // it('should render title in a h1 tag', async(() => {
  //   let fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   let compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('.toolbar-subtext').textContent).toContain('A Mobile Shopping List');
  // }));
});
