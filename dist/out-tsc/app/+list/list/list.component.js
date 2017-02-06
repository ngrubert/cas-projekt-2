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
import { ListService } from './../list.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AngularFire, FirebaseRef } from 'angularfire2';
export var catalog = (function () {
    function catalog(id, name, articles) {
        this.id = id;
        this.name = name;
        this.articles = articles;
    }
    return catalog;
}());
export var listArticle = (function () {
    function listArticle(isBasked, id, name, description, amount, price) {
        this.isBasked = isBasked;
        this.id = id;
        this.name = name;
        this.description = description;
        this.amount = amount;
        this.price = price;
    }
    return listArticle;
}());
export var ListComponent = (function () {
    function ListComponent(fb, af, _listService, route, router) {
        this.fb = fb;
        this._listService = _listService;
        this.route = route;
        this.router = router;
        this.catalogs = [];
        this.usersCatalogs = [];
        this.articles = [];
        this.searchArticles = [];
        this.articlesList = [];
        this.selectedArticleList = {};
        this.searchTerms = new Subject();
        this.af = af;
        this.db = new PouchDB("sList");
    }
    ListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.user = this.route.params
            .switchMap(function (params) {
            _this.url = params['email'];
            _this.sList = params['id'];
            _this.getOrAddUsernameToLocalDB();
            return Observable.from([1, 2, 3]).map(function (x) { return x; });
        });
        this.user.subscribe(function (c) { return console.log(c); });
        this.getCatalog();
        this.getUsersCatalog();
        this.getArticleBySlist();
        var search = document.getElementById("listSearch");
        var search$ = Observable.fromEvent(search, "keyup")
            .map(function (x) { return x.target.value; })
            .map(function (x) {
            return _this.performSearch(x);
        });
        search$.subscribe(function (x) {
            _this.searchArticles = x;
        });
        this.getAllArticles();
        this.showSideMenu();
    };
    ListComponent.prototype.showSideMenu = function () {
        document.getElementById('edit').style.display = 'block';
        document.getElementById('clear').style.display = 'block';
        document.getElementById('finished').style.display = 'block';
        document.getElementById('delete').style.display = 'block';
    };
    ListComponent.prototype.getOrAddUsernameToLocalDB = function () {
        var self = this;
        self.db.allDocs({ include_docs: true, descending: true }, function (err, doc) {
            if (err) {
                console.log(err);
                return;
            }
            if (doc.rows.length > 0) {
                self.setLocalUser(doc.rows[0].doc);
            }
            else {
                self.addUserToLocalDB();
            }
        });
    };
    ListComponent.prototype.setLocalUser = function (obj) {
        var self = this;
        if (this.url == obj.user) {
            this.db.get(obj._id).then(function (doc) {
                debugger;
                doc.sList = self.sList;
                doc.user = self.url;
                return self.db.put(doc);
            });
        }
        else {
            this.db.get(obj._id).then(function (doc) {
                debugger;
                doc.user = self.url;
                doc.sList = self.sList;
                return self.db.put(doc);
            });
        }
    };
    ListComponent.prototype.addUserToLocalDB = function () {
        this.db.post({ user: this.url });
    };
    ListComponent.prototype.performSearch = function (inp) {
        if (inp.trim() == '') {
            return [];
        }
        var arr = [];
        for (var i = 0; i < this.articles.length; i++) {
            if (this.articles[i].name.search(inp) > -1) {
                var item = this.articles[i];
                if (this.findInListArticles(item.$key)) {
                    item.backGroundColor = '#F24646';
                }
                else {
                    item.backGroundColor = '#6B8E23';
                }
                arr.push(this.articles[i]);
            }
        }
        if (arr.length == 0) {
            var obj = {
                name: inp,
                default: false
            };
            arr.push(obj);
        }
        return arr;
    };
    ListComponent.prototype.findInListArticles = function (nameKey) {
        var exists = false;
        for (var i = 0; i < this.articlesList.length; i++) {
            if (this.articlesList[i].id === nameKey) {
                exists = true;
                ;
            }
        }
        return exists;
    };
    ListComponent.prototype.getAllArticles = function () {
        var _this = this;
        var articles$ = this._listService.getAllArticles();
        articles$.subscribe(function (x) {
            _this.articles = x;
        });
    };
    ListComponent.prototype.getArticleBySlist = function () {
        var _this = this;
        this._listService.getArticlesForSlist(this.sList).map(function (x) { return x; })
            .subscribe(function (x) {
            if (x && x.length) {
                _this.articlesList = [];
                for (var i = 0; i < x.length; i++) {
                    var item = {};
                    item.id = x[i].id;
                    item.description = x[i].description;
                    item.isBasked = x[i].isBasked;
                    item.amount = x[i].amount;
                    item.price = x[i].price;
                    _this.articlesList.push(item);
                    _this.af.database.object("/articles/" + x[i].id).subscribe(function (p) {
                        if (p) {
                            for (var j = 0; j < _this.articlesList.length; j++) {
                                if (_this.articlesList[j].id == p.$key) {
                                    _this.articlesList[j].name = p.name;
                                }
                            }
                        }
                    });
                }
            }
        });
    };
    ListComponent.prototype.addToLIst = function (item) {
        var _this = this;
        this.searchArticles = [];
        if (item.$key) {
            this.addArticleToLIst(item.$key);
        }
        else {
            var obj_1 = {
                name: item.name,
                isDefault: false
            };
            this._listService.getArticleByName(obj_1.name).map(function (x) { return x; })
                .subscribe(function (x) {
                if (x && x.length > 0) {
                    item.$key = x[0].$key;
                    _this.addArticleToLIst(x[0].$key);
                }
                else {
                    _this._listService.addArticleAndAddToList(_this.sList, obj_1);
                }
            });
        }
    };
    ListComponent.prototype.addArticleToLIst = function (key) {
        var obj = {
            id: key
        };
        this._listService.addArticleToList(this.sList, obj);
    };
    ListComponent.prototype.getUsersCatalog = function () {
        var _this = this;
        var self = this;
        var items = this.af.database.list('/catalog/english', {
            query: {
                orderByChild: 'isDefault',
                equalTo: false
            }
        }).map(function (x) {
            return x;
        }).subscribe(function (x) {
            var self = _this;
            _this.usersCatalogs = [];
            if (x != undefined) {
                var _loop_1 = function(i) {
                    var item = {
                        name: x[i].name,
                        id: x[i].$key,
                        articles: []
                    };
                    _this.usersCatalogs.push(item);
                    for (property in x[i].articles) {
                        if (x[i].articles.hasOwnProperty(property)) {
                            self.af.database.object("/articles/" + x[i].articles[property]).subscribe(function (p) {
                                _this.usersCatalogs[i].articles.push(p);
                            });
                        }
                    }
                };
                var property;
                for (var i = 0; i < x.length; i++) {
                    _loop_1(i);
                }
            }
        });
    };
    ListComponent.prototype.getCatalog = function () {
        var _this = this;
        var self = this;
        var items = this.af.database.list('/catalog/english', {
            query: {
                orderByChild: 'isDefault',
                equalTo: true
            }
        }).map(function (x) {
            return x.sort(function (a, b) {
                var keyA = a.order, keyB = b.order;
                // Compare the 2 dates
                if (keyA < keyB)
                    return -1;
                if (keyA > keyB)
                    return 1;
                return 0;
            });
        }).subscribe(function (x) {
            var self = _this;
            _this.catalogs = [];
            if (x != undefined) {
                var _loop_2 = function(i) {
                    var item = {
                        name: x[i].name,
                        articles: []
                    };
                    _this.catalogs.push(item);
                    for (property in x[i].articles) {
                        if (x[i].articles.hasOwnProperty(property)) {
                            self.af.database.object("/articles/" + x[i].articles[property]).subscribe(function (x) {
                                _this.catalogs[i].articles.push(x);
                            });
                        }
                    }
                };
                var property;
                for (var i = 0; i < x.length; i++) {
                    _loop_2(i);
                }
            }
        });
    };
    ListComponent.prototype.pushToCatalog = function (item) {
        var updated = false;
        for (var i = 0; i < this.catalogs.length; i++) {
            if (this.catalogs[i].id == item.id) {
                this.catalogs[i].name = item.name;
                updated = true;
            }
        }
        if (!updated)
            this.catalogs.push(item);
    };
    ListComponent.prototype.changeInCatalogs = function (item, id) {
        for (var i = 0; i <= this.catalogs.length; i++) {
            if (this.catalogs[i] && this.catalogs[i].id == id) {
                var obj = {};
                obj.name = item.name;
                obj.id = item.$key;
                this.pushToArticles(obj, this.catalogs[i].id);
                console.log(this.catalogs);
            }
        }
    };
    ListComponent.prototype.pushToUsersCatalog = function (item) {
        var updated = false;
        for (var i = 0; i < this.usersCatalogs.length; i++) {
            if (this.usersCatalogs[i].id == item.id) {
                this.usersCatalogs[i].name = item.name;
                updated = true;
            }
        }
        if (!updated)
            this.usersCatalogs.push(item);
    };
    ListComponent.prototype.changeInUsersCatalogs = function (item, id) {
        for (var i = 0; i <= this.catalogs.length; i++) {
            if (this.usersCatalogs[i] && this.usersCatalogs[i].id == id) {
                var obj = {};
                obj.name = item.name;
                obj.id = item.$key;
                this.pushToUserArticles(obj, this.usersCatalogs[i].id);
            }
        }
    };
    ListComponent.prototype.pushToUserArticles = function (item, id) {
        var updated = false;
        for (var i = 0; i < this.usersCatalogs.length; i++) {
            if (this.usersCatalogs[i].id == id) {
                for (var j = 0; j < this.usersCatalogs[i].articles.length; j++) {
                    if (this.usersCatalogs[i].articles[j].id == item.id) {
                        this.usersCatalogs[i].articles[j].name = item.name;
                        updated = true;
                    }
                }
                if (!updated) {
                    this.usersCatalogs[i].articles.push(item);
                }
            }
        }
    };
    ListComponent.prototype.pushToArticles = function (item, id) {
        var updated = false;
        for (var i = 0; i < this.catalogs.length; i++) {
            if (this.catalogs[i].id == id) {
                for (var j = 0; j < this.catalogs[i].articles.length; j++) {
                    if (this.catalogs[i].articles[j].id == item.id) {
                        this.catalogs[i].articles[j].name = item.name;
                        updated = true;
                    }
                }
                if (!updated) {
                    this.catalogs[i].articles.push(item);
                }
            }
        }
    };
    ListComponent.prototype.toggleCatalog = function (evt) {
        var parentNode = evt.target.parentElement;
        var currentEle = parentNode.getElementsByClassName('slist-articles')[0];
        if (currentEle.style.display == 'none') {
            currentEle.style.display = 'block';
        }
        else {
            currentEle.style.display = 'none';
        }
    };
    ListComponent.prototype.selectedArticleInList = function (a) {
        this.selectedArticleList = a;
        var box = document.getElementsByClassName('slist-article-details');
        box[0].style.display = 'block';
    };
    ListComponent.prototype.addArticleAmount = function (amount) {
        var regex = /(\d+)/g;
        var split = '';
        var num = amount.match(regex);
        num = this.getNumberFromString(amount);
        if (num) {
            if (this.isKg(amount)) {
                num = parseFloat(num) + parseFloat("0.1");
                split = amount.split("k");
                this.selectedArticleList.amount = (Math.round(num * 10) / 10) + "k" + split[1].toLowerCase();
            }
            else if (this.isg(amount)) {
                if (num < 100) {
                    num = parseFloat(num) + parseFloat("10");
                    this.selectedArticleList.amount = (Math.round(num * 10) / 10) + "g";
                }
                else {
                    num = parseFloat(num) + parseFloat("50");
                    this.selectedArticleList.amount = (Math.round(num * 10) / 10) + "g";
                }
            }
            else {
                this.selectedArticleList.amount = (parseFloat((Math.round(amount * 10) / 10).toString()) + parseFloat("1")).toString();
            }
        }
    };
    ListComponent.prototype.getNumberFromString = function (str) {
        var regex = /[+-]?\d+(\.\d+)?/g;
        var floats = str.match(regex).map(function (v) { return parseFloat(v); });
        if (floats && floats.length > 0) {
            return floats[0];
        }
        else {
            return null;
        }
    };
    ListComponent.prototype.reduceArticleAmount = function (amount) {
        var regex = /(\d+)/g;
        var split = '';
        var num = amount.match(regex);
        num = this.getNumberFromString(amount);
        if (num) {
            if (this.isKg(amount)) {
                num = parseFloat(num) - parseFloat("0.1");
                split = amount.split("k");
                this.selectedArticleList.amount = (Math.round(num * 10) / 10) + "k" + split[1].toLowerCase();
            }
            else if (this.isg(amount)) {
                if (num < 100) {
                    num = parseFloat(num) - parseFloat("10");
                    this.selectedArticleList.amount = (Math.round(num * 10) / 10) + "g";
                }
                else {
                    num = parseFloat(num) - parseFloat("50");
                    this.selectedArticleList.amount = (Math.round(num * 10) / 10) + "g";
                }
            }
            else {
                this.selectedArticleList.amount = (parseFloat((Math.round(amount * 10) / 10).toString()) - parseFloat("1")).toString();
            }
        }
    };
    ListComponent.prototype.isKg = function (amount) {
        return amount.toLowerCase().indexOf('kg') !== -1;
    };
    ListComponent.prototype.isg = function (amount) {
        return amount.toLowerCase().indexOf('g') !== -1;
    };
    ListComponent.prototype.addToBasked = function (item) {
        this._listService.addIsBasked(item.id, this.sList);
        var box = document.getElementsByClassName('slist-article-details');
        box[0].style.display = 'none';
    };
    ListComponent.prototype.removeArticleFromSList = function (item) {
        this._listService.removeArticleFromSList(item.id, this.sList);
        var box = document.getElementsByClassName('slist-article-details');
        box[0].style.display = 'none';
    };
    ListComponent.prototype.updateSList = function (item) {
        this._listService.updateSList(item, this.sList);
        var box = document.getElementsByClassName('slist-article-details');
        box[0].style.display = 'none';
    };
    ListComponent = __decorate([
        Component({
            selector: 'list',
            templateUrl: './list.component.html',
            styleUrls: ['./list.component.scss'],
            providers: [ListService]
        }),
        __param(0, Inject(FirebaseRef)), 
        __metadata('design:paramtypes', [Object, AngularFire, ListService, ActivatedRoute, Router])
    ], ListComponent);
    return ListComponent;
}());
//# sourceMappingURL=/Users/grubert/WebstormProjects/cas-projekt2.1/src/app/+list/list/list.component.js.map