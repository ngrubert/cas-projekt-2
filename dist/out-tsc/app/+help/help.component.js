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
import { UsersService } from './../services/users.service';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';
export var HelpComponent = (function () {
    function HelpComponent(_userService) {
        this._userService = _userService;
    }
    HelpComponent.prototype.ngOnInit = function () {
        // this.getUsers();
    };
    HelpComponent.prototype.getUsers = function () {
        var _this = this;
        // Get all comments
        this._userService.getUsers()
            .subscribe(function (users) { return _this.abtusers = users; }, //Bind to view
        function (//Bind to view
            err) {
            // Log errors if any
            console.log(err);
        });
    };
    HelpComponent = __decorate([
        Component({
            selector: 'help',
            templateUrl: './help.component.html',
            styleUrls: ['./help.component.scss']
        }), 
        __metadata('design:paramtypes', [UsersService])
    ], HelpComponent);
    return HelpComponent;
}());
//# sourceMappingURL=/Users/grubert/WebstormProjects/cas-projekt2.1/src/app/+help/help.component.js.map