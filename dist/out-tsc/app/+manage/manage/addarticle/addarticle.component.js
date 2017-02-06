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
import { Router, ActivatedRoute } from '@angular/router';
import { ManageService } from './../../manage.service';
import { Observable } from 'rxjs/Observable';
import { AngularFire, FirebaseRef } from 'angularfire2';
export var catalog = (function () {
    function catalog(id, name, articles) {
        this.id = id;
        this.name = name;
        this.articles = articles;
    }
    return catalog;
}());
export var AddArticleComponent = (function () {
    function AddArticleComponent(fb, af, _manageService, route, router) {
        this.fb = fb;
        this._manageService = _manageService;
        this.route = route;
        this.router = router;
        this.catalogs = [];
        this.title = 'Add Article';
        this.list = [];
        this.listDup = [];
        this.af = af;
        this.db = new PouchDB("sList");
    }
    AddArticleComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.user = this.route.params
            .switchMap(function (params) {
            _this.sId = params['id'];
            return Observable.from([1, 2, 3]).map(function (x) { return x; });
        });
        this.user.subscribe(function (c) {
            console.log(c);
            _this.syncChanges();
        });
    };
    AddArticleComponent.prototype.syncChanges = function () {
        var self = this;
        this.db.allDocs({ include_docs: true, descending: true }, function (err, docs) {
            if (err) {
                console.log(err);
                return err;
            }
            if (docs && docs.rows.length > 0) {
                self.url = docs.rows[0].doc.email;
                this.getAllCategoriesForUser();
            }
        });
    };
    AddArticleComponent.prototype.getAllCategoriesForUser = function () {
        var _this = this;
        // this.list.push({name:'Category'});
        var categoryObs = this._manageService.getAllCategoriesForUser(this.url);
        categoryObs.subscribe(function (x) {
            _this.list = [];
            _this.listDup = x;
            for (var i = 0; i < x.length; i++) {
                var val = x[i];
                var item = {
                    name: val.name,
                    value: val.$key,
                };
                _this.list.push(item);
            }
        });
    };
    AddArticleComponent.prototype.onSaved = function (obj) {
        obj.isDefault = false;
        this.checkArticleExists(obj);
        this.router.navigate(['manage']);
    };
    AddArticleComponent.prototype.checkArticleExists = function (obj) {
        var self = this;
        this._manageService.checkArticleExists(obj.name)
            .subscribe(function (x) {
            if (x && x.length > 0) {
                self._manageService.addArticleToCategory(x[0].$key, obj.order);
            }
            else {
                var item = {
                    name: obj.name,
                    isDefault: false
                };
                self._manageService.addArticleAndAddToCategory(item, obj.order);
            }
        });
    };
    AddArticleComponent = __decorate([
        Component({
            selector: 'addarticle',
            templateUrl: './addarticle.component.html',
            styleUrls: ['./addarticle.component.scss'],
            providers: [ManageService]
        }),
        __param(0, Inject(FirebaseRef)), 
        __metadata('design:paramtypes', [Object, AngularFire, ManageService, ActivatedRoute, Router])
    ], AddArticleComponent);
    return AddArticleComponent;
}());
//# sourceMappingURL=/Users/grubert/WebstormProjects/cas-projekt2.1/src/app/+manage/manage/addarticle/addarticle.component.js.map