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
import { RouterModule } from '@angular/router';
import { ManageComponent } from './manage/manage.component';
import { AddCategoryComponent } from './manage/addcategory/addcategory.component';
import { EditCategoryComponent } from './manage/editcategory/editcategory.component';
import { AddArticleComponent } from './manage/addarticle/addarticle.component';
import { EditArticleComponent } from './manage/editarticle/editarticle.component';
import { DeleteCategoryComponent } from './manage/deletecategory/deletecategory.component';
// import { ManageComponent } from './manage/manage.component';
var routes = [
    { path: '', component: ManageComponent },
    // { path: 'manage', component: ManageComponent },
    { path: 'addcategory', component: AddCategoryComponent },
    { path: 'editcategory', component: EditCategoryComponent },
    { path: 'addarticle', component: AddArticleComponent },
    { path: 'editarticle', component: EditArticleComponent },
    { path: 'deletecategory/:id', component: DeleteCategoryComponent }
];
export var ManageRoutingModule = (function () {
    function ManageRoutingModule() {
    }
    ManageRoutingModule = __decorate([
        NgModule({
            imports: [RouterModule.forChild(routes)],
            exports: [RouterModule],
        }), 
        __metadata('design:paramtypes', [])
    ], ManageRoutingModule);
    return ManageRoutingModule;
}());
//# sourceMappingURL=/Users/grubert/WebstormProjects/cas-projekt2.1/src/app/+manage/manage.routing.js.map