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
var routes = [
    { path: '', redirectTo: '/index', pathMatch: 'full' },
    { path: 'home', loadChildren: './+home/home.module#HomeModule' },
    { path: 'create', loadChildren: './+create/create.module#CreateModule' },
    { path: 'help', loadChildren: './+help/help.module#HelpModule' },
    { path: 'list/:id', loadChildren: './+list/list.module#ListModule' },
    // { path: 'manage', loadChildren: './+manage/...' },
    { path: 'lists', loadChildren: './+lists/lists.module#ListsModule' },
    { path: 'editlist', loadChildren: './+edit/edit.module#EditModule' },
    { path: 'clearlist', loadChildren: './+clear/clear.module#ClearModule' },
    { path: 'deletelist', loadChildren: './+delete/delete.module#DeleteModule' },
    { path: 'finishlist', loadChildren: './+finish/finish.module#FinishModule' }
];
export var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        NgModule({
            imports: [RouterModule.forRoot(routes)],
            exports: [RouterModule],
        }), 
        __metadata('design:paramtypes', [])
    ], AppRoutingModule);
    return AppRoutingModule;
}());
//# sourceMappingURL=/Users/grubert/WebstormProjects/cas-projekt2.1/src/app/app.routing.js.map