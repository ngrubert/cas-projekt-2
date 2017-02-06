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
import { ManageRoutingModule } from './manage.routing';
import { SharedModule } from './../shared/shared.module';
import { ManageComponent } from './manage/manage.component';
import { AddArticleComponent } from './manage/addarticle/addarticle.component';
import { EditArticleComponent } from './manage/editarticle/editarticle.component';
import { AddCategoryComponent } from './manage/addcategory/addcategory.component';
import { EditCategoryComponent } from './manage/editcategory/editcategory.component';
import { DeleteCategoryComponent } from './manage/deletecategory/deletecategory.component';
import { SharedAddOrEditComponent } from './manage/sharedaddoredit/sharedaddoredit.component';
import { UsersService } from './../services/users.service';
import { MaterialModule } from '@angular/material';
import { AngularFireModule } from 'angularfire2';
import { firebaseConfig } from './../config/firebase-config';
export var ManageModule = (function () {
    function ManageModule() {
    }
    ManageModule = __decorate([
        NgModule({
            imports: [
                ManageRoutingModule, SharedModule,
                FormsModule,
                AngularFireModule.initializeApp(firebaseConfig),
                MaterialModule.forRoot(),
                CommonModule
            ],
            exports: [],
            declarations: [ManageComponent, AddArticleComponent, EditCategoryComponent, EditArticleComponent,
                AddCategoryComponent, SharedAddOrEditComponent, DeleteCategoryComponent],
            providers: [UsersService],
        }), 
        __metadata('design:paramtypes', [])
    ], ManageModule);
    return ManageModule;
}());
//# sourceMappingURL=/Users/grubert/WebstormProjects/cas-projekt2.1/src/app/+manage/manage.module.js.map