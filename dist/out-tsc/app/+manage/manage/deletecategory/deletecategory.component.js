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
export var DeleteCategoryComponent = (function () {
    function DeleteCategoryComponent(fb, af, _manageService, route, router) {
        this.fb = fb;
        this._manageService = _manageService;
        this.route = route;
        this.router = router;
        this.catalogs = [];
        this.title = 'Edit Category';
        this.list = [];
        this.category = {};
        this.af = af;
        this.db = new PouchDB("sList");
    }
    DeleteCategoryComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.user = this.route.params
            .switchMap(function (params) {
            // this.url = '-K_PcS3U-bzP0Jgye_Xo';
            _this.catId = params['id'];
            // this.catId=params['catId'];
            return Observable.from([1, 2, 3]).map(function (x) { return x; });
        });
        this.user.subscribe({});
        this.getCategory();
    };
    DeleteCategoryComponent.prototype.syncChanges = function () {
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
    DeleteCategoryComponent.prototype.getCategory = function () {
        var _this = this;
        var getCategory$ = this._manageService.getCategoryById(this.catId);
        getCategory$.subscribe(function (x) {
            _this.category = x;
            _this.modelValue = x.name;
        });
    };
    DeleteCategoryComponent.prototype.cancelDeleteCategory = function () {
        this.router.navigate(['manage']);
    };
    DeleteCategoryComponent.prototype.deleteCategory = function (id) {
        this._manageService.deleteCategory(id);
        this.router.navigate(['manage']);
    };
    DeleteCategoryComponent = __decorate([
        Component({
            selector: 'deletecategory',
            templateUrl: './deletecategory.component.html',
            styleUrls: ['./deletecategory.component.scss'],
            providers: [ManageService]
        }),
        __param(0, Inject(FirebaseRef)), 
        __metadata('design:paramtypes', [Object, AngularFire, ManageService, ActivatedRoute, Router])
    ], DeleteCategoryComponent);
    return DeleteCategoryComponent;
}());
//# sourceMappingURL=/Users/grubert/WebstormProjects/cas-projekt2.1/src/app/+manage/manage/deletecategory/deletecategory.component.js.map