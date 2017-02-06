var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditRoutingModule } from './edit.routing';
import { SharedModule } from './../shared/shared.module';
import { EditComponent } from './edit/edit.component';
import { UsersService } from './../services/users.service';
import { MaterialModule } from '@angular/material';
import { AngularFireModule } from 'angularfire2';
import { firebaseConfig } from './../config/firebase-config';
export var EditModule = (function () {
    function EditModule() {
    }
    EditModule = __decorate([
        NgModule({
            imports: [
                EditRoutingModule, SharedModule,
                FormsModule,
                AngularFireModule.initializeApp(firebaseConfig),
                MaterialModule.forRoot(),
                CommonModule
            ],
            exports: [],
            declarations: [EditComponent],
            providers: [UsersService],
        }), 
        __metadata('design:paramtypes', [])
    ], EditModule);
    return EditModule;
}());
//# sourceMappingURL=/Users/grubert/WebstormProjects/cas-projekt2.1/src/app/+edit/edit.module.js.map