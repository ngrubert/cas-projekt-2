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
import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AngularFire, FirebaseRef } from 'angularfire2';
import { Router, ActivatedRoute } from '@angular/router';
export var ManageService = (function () {
    function ManageService(fb, http, af, router, route) {
        var _this = this;
        this.fb = fb;
        this.http = http;
        this.router = router;
        this.route = route;
        this.af = af;
        this.getAllRelatedUsers();
        this.user = this.route.params
            .switchMap(function (params) {
            _this.url = params['email'];
            debugger;
            _this.sId = params['id'];
            return Observable.from([1, 2, 3]).map(function (x) { return x; });
        });
        this.user.subscribe(function (c) { return console.log(c); });
    }
    ManageService.prototype.getAllDefaultCatalog = function () {
        var a;
        var items = this.af.database.list('/catalog/english')
            .map(function (x) { return x; }).subscribe(function (x) { return a; });
        return a;
    };
    ManageService.prototype.getArticles = function (data) {
        return this.af.database.object("/articles/" + data).subscribe(function (x) { return x; });
    };
    ManageService.prototype.getAllCategories = function () {
        var a;
        var items = this.af.database.list('/catalog/english')
            .map(function (x) { return x; });
        return items;
    };
    ManageService.prototype.getAllArticles = function () {
        var items = this.af.database.list('/articles')
            .map(function (x) { return x; });
        return items;
    };
    ManageService.prototype.searchArticles = function (val) {
        return this.af.database.list('articles', {
            query: {
                orderByChild: '$value',
                equalTo: val
            }
        });
    };
    ManageService.prototype.getAllCategoriesForUser = function (user) {
        return this.af.database.list('/catalog/english', {
            query: {
                orderByChild: "users/" + user,
                equalTo: true
            }
        });
    };
    ManageService.prototype.addCategory = function (obj) {
        var categories = this.af.database.list('/catalog/english');
        var categoryAdded = categories.push(obj);
        var addToCatalog = this.af.database.object("catalog/english/" + categoryAdded.key + "/users");
        // let sListUsers=this.af.database.list(`/sListUsers/${sId}`);
        // sListUsers.subscribe((x:any)=>{
        // 	console.log(x);
        // 	if(x && x.length>0){
        // 		x.forEach(function(item:any){
        // 			let obj:any={};
        // 			obj[item.$key]=true;
        // 			addToCatalog.update(obj);
        // 		})
        // 	}
        // })
        this.myUsers.forEach(function (item) {
            var obj = {};
            obj[item] = true;
            addToCatalog.update(obj);
        });
    };
    ManageService.prototype.editCategory = function (obj, catId) {
        var categories = this.af.database.object("/catalog/english/" + catId);
        var categoryAdded = categories.update({ name: obj.name, order: obj.order });
        var addToCatalog = this.af.database.object("catalog/english/" + catId + "/users");
        this.myUsers.forEach(function (item) {
            var obj = {};
            obj[item] = true;
            addToCatalog.update(obj);
        });
    };
    ManageService.prototype.getCategoryById = function (id) {
        var category = this.af.database.object("catalog/english/" + id).map(function (x) { return x; });
        return category;
    };
    ManageService.prototype.checkArticleExists = function (obj) {
        var article = this.af.database.list("articles", {
            query: {
                orderByChild: 'name',
                equalTo: obj
            }
        }).map(function (x) { return x; });
        return article;
    };
    ManageService.prototype.addArticleToCategory = function (key, catKey) {
        if (key) {
            var addArticleToCategory_1 = this.af.database.list("catalog/english/" + catKey + "/articles");
            var checkArticleInCategory = this.af.database.list("catalog/english/" + catKey + "/articles").map(function (x) {
                var exists = false;
                for (var i = 0; i < x.length; i++) {
                    if (x[i].$value == key) {
                        exists = true;
                    }
                }
                return exists;
            });
            checkArticleInCategory.subscribe(function (x) {
                if (!x) {
                    addArticleToCategory_1.push(key);
                }
            });
        }
    };
    ManageService.prototype.addArticleAndAddToCategory = function (obj, catId) {
        var addArticle = this.af.database.list('articles');
        var articleAdded = addArticle.push(obj);
        var key = articleAdded.key;
        this.addArticleToCategory(key, catId);
    };
    ManageService.prototype.addArticle = function (obj) {
        var addArticle = this.af.database.list('articles');
        var articleAdded = addArticle.push(obj);
    };
    ManageService.prototype.getArticle = function (id) {
        return this.af.database.object("/articles/" + id);
    };
    ManageService.prototype.removeArticleFromCategory = function (artId, catId) {
        var _this = this;
        var removeFromCategory = this.af.database.list("catalog/english/" + catId + "/articles").map(function (x) {
            var val = '';
            for (var i = 0; i < x.length; i++) {
                if (x[i].$value == artId) {
                    debugger;
                    val = x[i].$key;
                }
            }
            return val;
        });
        removeFromCategory.subscribe(function (x) {
            if (x != '') {
                _this.af.database.object("catalog/english/" + catId + "/articles/" + x).remove();
            }
        });
    };
    ManageService.prototype.deleteCategory = function (id) {
        var category = this.af.database.object("catalog/english/" + id);
        category.remove();
    };
    ManageService.prototype.getAllRelatedUsers = function () {
        var _this = this;
        var sListUsers = this.af.database.list('sList').map(function (x) {
            return _this.getRelatedUsers(x);
        });
        sListUsers.subscribe(function (x) {
            _this.myUsers = [];
            if (x && x.length > 0) {
                _this.myUsers = x;
            }
        });
    };
    ManageService.prototype.getRelatedUsers = function (x) {
        var arr = [];
        var arrFinal = [];
        var arrMap = x.map(function (item) { return item.users; });
        for (var i = 0; i < arrMap.length; i++) {
            if (arrMap[i]) {
                if (arrMap[i].includes(this.url)) {
                    arr.push(arrMap[i]);
                }
            }
        }
        for (var j = 0; j < arr.length; j++) {
            for (var k = 0; k < arr[j].length; k++) {
                arrFinal.push(arr[j][k]);
            }
        }
        return arrFinal.filter(function (v, i, a) { return a.indexOf(v) === i; });
        ;
    };
    ManageService = __decorate([
        Injectable(),
        __param(0, Inject(FirebaseRef)), 
        __metadata('design:paramtypes', [Object, Http, AngularFire, Router, ActivatedRoute])
    ], ManageService);
    return ManageService;
}());
//# sourceMappingURL=/Users/grubert/WebstormProjects/cas-projekt2.1/src/app/+manage/manage.service.js.map