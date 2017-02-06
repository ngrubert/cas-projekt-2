var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { UsersService } from './../../services/users.service';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';
export var HomeComponent = (function () {
    function HomeComponent(_userService) {
        this._userService = _userService;
        this.commentsUrl = 'api';
    }
    HomeComponent.prototype.ngOnDestroy = function () {
    };
    HomeComponent.prototype.ngOnInit = function () {
        this.getUsers();
    };
    HomeComponent.prototype.getUsers = function () {
        var _this = this;
        // Get all comments
        this._userService.getUsersFirebase()
            .subscribe(function (users) { return _this.users = users; }, //Bind to view
        function (//Bind to view
            err) {
            // Log errors if any
            console.log(err);
        });
    };
    HomeComponent = __decorate([
        Component({
            selector: 'home',
            templateUrl: './home.component.html',
            styleUrls: ['./home.component.scss'],
            providers: [UsersService]
        }), 
        __metadata('design:paramtypes', [UsersService])
    ], HomeComponent);
    return HomeComponent;
}());
//# sourceMappingURL=/Users/grubert/WebstormProjects/cas-projekt2.1/src/app/+home/home/home.component.js.map