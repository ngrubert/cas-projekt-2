import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularFireModule } from 'angularfire2';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { MaterialModule } from '@angular/material';

import { AppRoutingModule } from './app.routing';
import { IndexModule } from './index/index.module';
import { firebaseConfig } from './config/firebase-config';
import { UsersService } from './services/users.service';
import { AppComponent } from './app.component';
import { TranslateModule } from '@ngx-translate/core';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http);
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
    IndexModule,
    TranslateModule.forRoot()
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }, UsersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
