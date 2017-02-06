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
export var EditCategoryComponent = (function () {
    function EditCategoryComponent(fb, af, _manageService, route, router) {
        this.fb = fb;
        this._manageService = _manageService;
        this.route = route;
        this.router = router;
        this.catalogs = [];
        this.title = 'Edit Category';
        this.list = [];
        this.category = {};
        this.af = af;
    }
    EditCategoryComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.user = this.route.params
            .switchMap(function (params) {
            // this.url = '-K_PcS3U-bzP0Jgye_Xo';
            _this.sId = params['id'];
            _this.catId = params['catId'];
            return Observable.from([1, 2, 3]).map(function (x) { return x; });
        });
        this.user.subscribe(function (c) {
            _this.syncChanges();
        });
    };
    EditCategoryComponent.prototype.syncChanges = function () {
        var self = this;
        this.db.allDocs({ include_docs: true, descending: true }, function (err, docs) {
            if (err) {
                console.log(err);
                return err;
            }
            if (docs && docs.rows.length > 0) {
                self.url = docs.rows[0].doc.email;
                self.getCategory();
            }
        });
    };
    EditCategoryComponent.prototype.getCategory = function () {
        var _this = this;
        var getCategory$ = this._manageService.getCategoryById(this.catId);
        getCategory$.subscribe(function (x) {
            _this.category = x;
            _this.modelValue = x.order;
        });
        var categoryObs = this._manageService.getAllCategoriesForUser(this.url);
        categoryObs.subscribe(function (x) {
            _this.list = [];
            var flags = [], output = [], l = x.length, i;
            for (i = 0; i < l; i++) {
                if (flags[x[i].$key])
                    continue;
                flags[x[i].$key] = true;
                output.push(x[i].$key);
            }
            var listArr = Array.apply(1, { length: output.length }).map(Number.call, Number);
            var listArrMap = listArr.map(function (val) { return ++val; });
            for (var i_1 = 0; i_1 < listArrMap.length; i_1++) {
                var val = listArrMap[i_1];
                var item = {
                    name: val,
                    value: val
                };
                _this.list.push(item);
            }
        });
    };
    EditCategoryComponent.prototype.onSaved = function (obj) {
        obj.isDefault = false;
        this._manageService.editCategory(obj, this.catId);
        this.router.navigate(['manage']);
    };
    EditCategoryComponent.prototype.deleteCategory = function (id) {
        this.router.navigate(['manage/deletecategory', id]);
    };
    EditCategoryComponent = __decorate([
        Component({
            selector: 'editcategory',
            templateUrl: './editcategory.component.html',
            styleUrls: ['./editcategory.component.scss'],
            providers: [ManageService]
        }),
        __param(0, Inject(FirebaseRef)), 
        __metadata('design:paramtypes', [Object, AngularFire, ManageService, ActivatedRoute, Router])
    ], EditCategoryComponent);
    return EditCategoryComponent;
}());
//# sourceMappingURL=/Users/grubert/WebstormProjects/cas-projekt2.1/src/app/+manage/manage/editcategory/editcategory.component.js.map