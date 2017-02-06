var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
export var AppComponent = (function () {
    function AppComponent(route, router) {
        this.route = route;
        this.router = router;
        this.title = 'app works!';
        this.db = new PouchDB("sList");
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        var self = this;
        this.user = this.route.params
            .switchMap(function (params) {
            _this.url = params['email'];
            _this.sList = params['id'];
            return Observable.from([1, 2, 3]).map(function (x) { return x; });
        });
        this.user.subscribe(function (c) { return console.log(c); });
        this.detectDevice();
        this.syncChanges();
    };
    AppComponent.prototype.syncChanges = function () {
        var self = this;
        this.db.allDocs({ include_docs: true, descending: true }, function (err, docs) {
            if (err) {
                console.log(err);
                return err;
            }
            if (docs && docs.rows.length > 0) {
                self.setLocalUser(docs.rows[0].doc);
            }
        });
    };
    AppComponent.prototype.ngOnDestroy = function () {
    };
    AppComponent.prototype.hideNav = function () {
        this.start.toggle();
    };
    AppComponent.prototype.setLocalUser = function (obj) {
        if (obj)
            this.localUser = obj.user;
    };
    AppComponent.prototype.detectDevice = function () {
        if (window.innerWidth <= 800) {
            this.isMobile = true;
        }
        else {
            this.isMobile = false;
        }
    };
    __decorate([
        ViewChild('start'), 
        __metadata('design:type', Object)
    ], AppComponent.prototype, "start", void 0);
    AppComponent = __decorate([
        Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.scss']
        }), 
        __metadata('design:paramtypes', [ActivatedRoute, Router])
    ], AppComponent);
    return AppComponent;
}());
//# sourceMappingURL=/Users/grubert/WebstormProjects/cas-projekt2.1/src/app/app.component.js.map