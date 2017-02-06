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
import { ManageService } from './../manage.service';
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
export var ManageComponent = (function () {
    function ManageComponent(fb, af, _manageService, route, router) {
        this.fb = fb;
        this._manageService = _manageService;
        this.route = route;
        this.router = router;
        this.catalogs = [];
        this.usersCatalogs = [];
        this.articles = [];
        this.searchArticles = [];
        this.searchTerms = new Subject();
        this.af = af;
    }
    ManageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.user = this.route.params
            .switchMap(function (params) {
            // this.url = '-K_PcS3U-bzP0Jgye_Xo';
            return Observable.from([1, 2, 3]).map(function (x) { return x; });
        });
        this.user.subscribe(function (x) {
            _this.syncChanges();
        });
    };
    ManageComponent.prototype.syncChanges = function () {
        var self = this;
        this.db.allDocs({ include_docs: true, descending: true }, function (err, docs) {
            if (err) {
                console.log(err);
                return err;
            }
            if (docs && docs.rows.length > 0) {
                self.url = docs.rows[0].doc.email;
                self.getCatalog();
                self.getUsersCatalog();
                self.getAllArticles();
            }
        });
    };
    ManageComponent.prototype.getAllArticles = function () {
        var _this = this;
        var articles$ = this._manageService.getAllArticles();
        articles$.subscribe(function (x) {
            _this.articles = x;
        });
    };
    ManageComponent.prototype.getUsersCatalog = function () {
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
                            self.af.database.object("/articles/" + x[i].articles[property]).subscribe(function (x) {
                                _this.usersCatalogs[i].articles.push(x);
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
    ManageComponent.prototype.getCatalog = function () {
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
    ManageComponent.prototype.pushToCatalog = function (item) {
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
    ManageComponent.prototype.changeInCatalogs = function (item, id) {
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
    ManageComponent.prototype.pushToUsersCatalog = function (item) {
        var updated = false;
        for (var i = 0; i < this.usersCatalogs.length; i++) {
            if (this.usersCatalogs[i].id == item.id) {
                this.usersCatalogs[i].name = item.name;
                this.usersCatalogs[i].id = item.id;
                updated = true;
            }
        }
        if (!updated)
            this.usersCatalogs.push(item);
    };
    ManageComponent.prototype.changeInUsersCatalogs = function (item, id) {
        for (var i = 0; i <= this.catalogs.length; i++) {
            if (this.usersCatalogs[i] && this.usersCatalogs[i].id == id) {
                var obj = {};
                obj.name = item.name;
                obj.id = item.$key;
                this.pushToUserArticles(obj, this.usersCatalogs[i].id);
            }
        }
    };
    ManageComponent.prototype.pushToUserArticles = function (item, id) {
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
    ManageComponent.prototype.pushToArticles = function (item, id) {
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
    ManageComponent.prototype.toggleCatalog = function (evt) {
        // let parentNode=evt.target.parentElement;
        // let currentEle=parentNode.getElementsByClassName('slist-articles')[0];
        if (evt.style.display == 'none') {
            evt.style.display = 'block';
        }
        else {
            evt.style.display = 'none';
        }
    };
    ManageComponent.prototype.deleteArticle = function (artId, catId) {
        this._manageService.removeArticleFromCategory(artId, catId);
    };
    ManageComponent.prototype.showDelete = function (deleteButton, deleteArticle) {
        deleteButton.style.display = 'none';
        deleteArticle.style.display = 'block';
    };
    ManageComponent.prototype.hideDelete = function (deleteButton, deleteArticle) {
        deleteButton.style.display = 'flex';
        deleteArticle.style.display = 'none';
    };
    ManageComponent = __decorate([
        Component({
            selector: 'manage',
            templateUrl: './manage.component.html',
            styleUrls: ['./manage.component.scss'],
            providers: [ManageService]
        }),
        __param(0, Inject(FirebaseRef)), 
        __metadata('design:paramtypes', [Object, AngularFire, ManageService, ActivatedRoute, Router])
    ], ManageComponent);
    return ManageComponent;
}());
//# sourceMappingURL=/Users/grubert/WebstormProjects/cas-projekt2.1/src/app/+manage/manage/manage.component.js.map