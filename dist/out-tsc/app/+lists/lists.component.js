var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Component, Inject } from '@angular/core';
import { UsersService } from './../services/users.service';
import { AngularFire, FirebaseRef } from 'angularfire2';
import { Router, ActivatedRoute } from '@angular/router';
export var ListsComponent = (function () {
    function ListsComponent(_userService, fb, af, route, router) {
        this._userService = _userService;
        this.fb = fb;
        this.route = route;
        this.router = router;
        this.db = new PouchDB("sList");
        this.af = af;
    }
    ListsComponent.prototype.ngOnInit = function () {
        this.syncChanges();
        // this.getUsers();
    };
    ListsComponent.prototype.syncChanges = function () {
        var self = this;
        this.db.allDocs({ include_docs: true, descending: true }, function (err, docs) {
            if (err) {
                console.log(err);
                return err;
            }
            if (docs && docs.rows.length > 0) {
                // this.getSLists(docs.rows[0].doc.user);
                self.url = docs.rows[0].doc.user;
                self.getAllLists();
            }
        });
    };
    ListsComponent.prototype.searchSLists = function () {
        var self = this;
        this.af.database.list("users", {
            query: {
                orderByChild: "email",
                equalTo: this.email
            }
        }).map(function (x) { return x; }).subscribe(function (p) {
            if (p && p.length > 0) {
                self.url = p[0].$key;
                self.getAllLists();
            }
        });
    };
    ListsComponent.prototype.getAllLists = function () {
        var _this = this;
        var self = this;
        this.af.database.list('sList').map(function (x) {
            //console.log("getAllLists(), x.length -->" + x.length);
            return x;
        }).subscribe(function (x) {
            _this.sLists = [];
            if (x && x.length > 0) {
                for (var i = 0; i < x.length; i++) {
                    console.log(x[i]);
                    if (x[i] && x[i].users && x[i].users.length) {
                        for (var j = 0; j < x[i].users.length; j++) {
                            if (x[i].users[j] == _this.url) {
                                self.sLists.push(x[i]);
                            }
                        }
                    }
                }
            }
        });
    };
    ListsComponent.prototype.goToSlist = function (item) {
        this.router.navigate(['list', item.$key, { email: this.url }]);
    };
    ListsComponent.prototype.createNewList = function () {
        this.router.navigate(['create']);
    };
    ListsComponent = __decorate([
        Component({
            selector: 'lists',
            templateUrl: './lists.component.html',
            styleUrls: ['./lists.component.scss']
        }),
        __param(1, Inject(FirebaseRef)), 
        __metadata('design:paramtypes', [UsersService, Object, AngularFire, ActivatedRoute, Router])
    ], ListsComponent);
    return ListsComponent;
}());
//# sourceMappingURL=/Users/grubert/WebstormProjects/cas-projekt2.1/src/app/+lists/lists.component.js.map