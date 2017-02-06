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
export var AddCategoryComponent = (function () {
    function AddCategoryComponent(fb, af, _manageService, route, router) {
        this.fb = fb;
        this._manageService = _manageService;
        this.route = route;
        this.router = router;
        this.title = 'Add Category';
        this.list = [];
        this.catalogs = [];
        this.af = af;
        this.db = new PouchDB("sList");
    }
    AddCategoryComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.user = this.route.params
            .switchMap(function (params) {
            // this.url = '-K_PcS3U-bzP0Jgye_Xo';
            _this.sId = params['id'];
            return Observable.from([1, 2, 3]).map(function (x) { return x; });
        });
        this.user.subscribe(function (c) {
            _this.syncChanges();
        });
    };
    AddCategoryComponent.prototype.syncChanges = function () {
        var self = this;
        this.db.allDocs({ include_docs: true, descending: true }, function (err, docs) {
            if (err) {
                console.log(err);
                return err;
            }
            if (docs && docs.rows.length > 0) {
                self.url = docs.rows[0].doc.email;
                self.getAllCategoriesForUser();
            }
        });
    };
    AddCategoryComponent.prototype.getAllCategoriesForUser = function () {
        var _this = this;
        // this.list.push({name:'Category'});
        var categoryObs = this._manageService.getAllCategoriesForUser(this.url);
        categoryObs.subscribe(function (x) {
            _this.modelValue = x.length + 1;
            var listArr = Array.apply(1, { length: _this.modelValue }).map(Number.call, Number);
            var listArrMap = listArr.map(function (val) { return ++val; });
            for (var i = 0; i < listArrMap.length; i++) {
                var val = listArrMap[i];
                var item = {
                    name: val,
                    value: val
                };
                _this.list.push(item);
            }
        });
    };
    AddCategoryComponent.prototype.onSaved = function (obj) {
        obj.isDefault = false;
        this._manageService.addCategory(obj);
        this.router.navigate(['manage']);
    };
    AddCategoryComponent = __decorate([
        Component({
            selector: 'addcategory',
            templateUrl: './addcategory.component.html',
            styleUrls: ['./addcategory.component.scss'],
            providers: [ManageService]
        }),
        __param(0, Inject(FirebaseRef)), 
        __metadata('design:paramtypes', [Object, AngularFire, ManageService, ActivatedRoute, Router])
    ], AddCategoryComponent);
    return AddCategoryComponent;
}());
//# sourceMappingURL=/Users/grubert/WebstormProjects/cas-projekt2.1/src/app/+manage/manage/addcategory/addcategory.component.js.map