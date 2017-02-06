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
export var ListService = (function () {
    function ListService(fb, http, af, router, route) {
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
    ListService.prototype.addArticleToList = function (sList, art) {
        var articleInList = this.af.database.list("/sList/" + sList + "/articles");
        var findArtInList = this.af.database.list("/sList/" + sList + "/articles", {
            query: {
                orderByChild: 'id',
                equalTo: art.id
            }
        }).map(function (x) { return x; }).subscribe(function (x) {
            if (x && x.length > 0) { }
            else {
                articleInList.push(art);
            }
        });
    };
    ListService.prototype.addArticleAndAddToList = function (sList, obj) {
        var _this = this;
        var addArticle = this.af.database.list('articles');
        var checkInAArticle = this.af.database.list('articles', {
            query: {
                orderByChild: 'name',
                equalTo: obj.name
            }
        }).map(function (x) { return x; }).subscribe(function (x) {
            if (x && x.length > 0) {
                var obj_1 = {
                    id: x[0].$key
                };
                _this.addArticleToList(sList, obj_1);
            }
            else {
                var articleAdded = addArticle.push(obj);
                _this.addArticleToList(sList, articleAdded.key);
            }
        });
    };
    ListService.prototype.getAllDefaultCatalog = function () {
        var a;
        var items = this.af.database.list('/catalog/english')
            .map(function (x) { return x; }).subscribe(function (x) { return a; });
        return a;
    };
    ListService.prototype.getArticles = function (data) {
        return this.af.database.object("/articles/" + data).subscribe(function (x) { return x; });
    };
    ListService.prototype.getArticlesForSlist = function (sList) {
        return this.af.database.list("/sList/" + sList + "/articles");
    };
    ListService.prototype.getArticleByName = function (name) {
        var getArticle = this.af.database.list("/articles", {
            query: {
                orderByChild: 'name',
                equalTo: name
            }
        });
        return getArticle;
    };
    ListService.prototype.getAllCategories = function () {
        var a;
        var items = this.af.database.list('/catalog/english')
            .map(function (x) { return x; });
        return items;
    };
    ListService.prototype.getAllArticles = function () {
        var items = this.af.database.list('/articles')
            .map(function (x) { return x; });
        return items;
    };
    ListService.prototype.searchArticles = function (val) {
        return this.af.database.list('articles', {
            query: {
                orderByChild: '$value',
                equalTo: val
            }
        });
    };
    ListService.prototype.getAllCategoriesForUser = function (user) {
        return this.af.database.list('/catalog/english', {
            query: {
                orderByChild: "users/" + user,
                equalTo: true
            }
        });
    };
    ListService.prototype.addCategory = function (obj) {
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
    ListService.prototype.editCategory = function (obj, catId) {
        var categories = this.af.database.object("/catalog/english/" + catId);
        var categoryAdded = categories.update({ name: obj.name, order: obj.order });
        var addToCatalog = this.af.database.object("catalog/english/" + catId + "/users");
        this.myUsers.forEach(function (item) {
            var obj = {};
            obj[item] = true;
            addToCatalog.update(obj);
        });
    };
    ListService.prototype.getCategoryById = function (id) {
        var category = this.af.database.object("catalog/english/" + id).map(function (x) { return x; });
        return category;
    };
    ListService.prototype.checkArticleExists = function (obj) {
        var article = this.af.database.list("articles", {
            query: {
                orderByChild: 'name',
                equalTo: obj
            }
        }).map(function (x) { return x; });
        return article;
    };
    ListService.prototype.addArticleToCategory = function (key, catKey) {
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
    ListService.prototype.addArticleAndAddToCategory = function (obj, catId) {
        var addArticle = this.af.database.list('articles');
        var articleAdded = addArticle.push(obj);
        var key = articleAdded.key;
        this.addArticleToCategory(key, catId);
    };
    ListService.prototype.getArticle = function (id) {
        return this.af.database.object("/articles/" + id);
    };
    ListService.prototype.removeArticleFromCategory = function (artId, catId) {
        var _this = this;
        var removeFromCategory = this.af.database.list("catalog/english/" + catId + "/articles").map(function (x) {
            var val = '';
            for (var i = 0; i < x.length; i++) {
                if (x[i].$value == artId) {
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
    ListService.prototype.getAllRelatedUsers = function () {
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
    ListService.prototype.getRelatedUsers = function (x) {
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
    ListService.prototype.addIsBasked = function (key, sListId) {
        var articleItem = this.af.database.list("sList/" + sListId + "/articles/");
        var article = this.af.database.list("sList/" + sListId + "/articles/", {
            query: {
                orderByChild: 'id',
                equalTo: key
            }
        }).map(function (x) { return x; }).subscribe(function (x) {
            if (x && x.length > 0) {
                articleItem.update(x[0].$key, { isBasked: true });
            }
        });
    };
    ListService.prototype.removeArticleFromSList = function (key, sListId) {
        var self = this;
        var articleItem = this.af.database.list("sList/" + sListId + "/articles/");
        var article = this.af.database.list("sList/" + sListId + "/articles/", {
            query: {
                orderByChild: 'id',
                equalTo: key
            }
        }).map(function (x) { return x; }).subscribe(function (x) {
            if (x && x.length > 0) {
                self.af.database.list("sList/" + sListId + "/articles/" + x[0].$key).remove();
            }
        });
    };
    ListService.prototype.updateSList = function (item, sListId) {
        var articleItem = this.af.database.list("sList/" + sListId + "/articles/");
        var article = this.af.database.list("sList/" + sListId + "/articles/", {
            query: {
                orderByChild: 'id',
                equalTo: item.id
            }
        }).map(function (x) { return x; }).subscribe(function (x) {
            if (x && x.length > 0) {
                articleItem.update(x[0].$key, {
                    isBasked: item.isBasked,
                    description: item.description,
                    amount: item.amount
                });
            }
        });
    };
    ListService.prototype.getRecentSListArticles = function (sList) {
        return this.af.database.list("sList/" + sList + "/articles").map(function (arr) {
            return arr;
        });
    };
    ListService = __decorate([
        Injectable(),
        __param(0, Inject(FirebaseRef)), 
        __metadata('design:paramtypes', [Object, Http, AngularFire, Router, ActivatedRoute])
    ], ListService);
    return ListService;
}());
//# sourceMappingURL=/Users/grubert/WebstormProjects/cas-projekt2.1/src/app/+list/list.service.js.map