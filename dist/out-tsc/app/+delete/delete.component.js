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
import { Inject } from '@angular/core';
import { Component } from '@angular/core';
import { UsersService } from './../services/users.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFire, FirebaseRef } from 'angularfire2';
export var DeleteComponent = (function () {
    function DeleteComponent(_userService, route, router, fb, af) {
        this._userService = _userService;
        this.route = route;
        this.router = router;
        this.fb = fb;
        this.db = new PouchDB("sList");
        this.af = af;
    }
    DeleteComponent.prototype.ngOnInit = function () {
        // this.getUsers();
        this.syncChanges();
        this.showSideMenu();
    };
    DeleteComponent.prototype.showSideMenu = function () {
        document.getElementById('edit').style.display = 'block';
        document.getElementById('clear').style.display = 'block';
        document.getElementById('finished').style.display = 'block';
        document.getElementById('delete').style.display = 'block';
    };
    DeleteComponent.prototype.syncChanges = function () {
        var self = this;
        this.db.allDocs({ include_docs: true, descending: true }, function (err, docs) {
            if (err) {
                console.log(err);
                return err;
            }
            if (docs && docs.rows.length > 0) {
                debugger;
                self.sList = docs.rows[0].doc.sList;
                self.url = docs.rows[0].doc.user;
                self.localDBID = docs.rows[0].doc._id;
                self.getSListDetail();
            }
        });
    };
    DeleteComponent.prototype.getSListDetail = function () {
        var _this = this;
        this.af.database.object("sList/" + this.sList).map(function (x) { return x; }).subscribe(function (x) {
            _this.modelValue = x.title;
        });
    };
    DeleteComponent.prototype.deleteSList = function () {
        var self = this;
        this.af.database.list("sList/" + this.sList).remove();
        this.db.get(this.localDBID).then(function (doc) {
            debugger;
            doc.user = self.url;
            doc.sList = null;
            return self.db.put(doc);
        });
        this.router.navigate(["lists", { email: this.url }]);
    };
    DeleteComponent.prototype.cancel = function () {
        this.router.navigate(["lists", { email: this.url }]);
    };
    DeleteComponent = __decorate([
        Component({
            selector: 'delete',
            templateUrl: './delete.component.html',
            styleUrls: ['./delete.component.scss']
        }),
        __param(3, Inject(FirebaseRef)), 
        __metadata('design:paramtypes', [UsersService, ActivatedRoute, Router, Object, AngularFire])
    ], DeleteComponent);
    return DeleteComponent;
}());
//# sourceMappingURL=/Users/grubert/WebstormProjects/cas-projekt2.1/src/app/+delete/delete.component.js.map