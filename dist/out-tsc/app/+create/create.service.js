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
// Import RxJs required methods
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';
export var CreateService = (function () {
    function CreateService(fb, http, af) {
        this.fb = fb;
        this.http = http;
        this.users = '/users';
        this.invitedUsers = [];
        this.mailedUsers = [];
        this.af = af;
        this.roorRef = fb.database().ref('users');
        this.sListUsersRef = fb.database().ref('sListUsers');
    }
    CreateService.prototype.createSList = function (list) {
        var sListRef = this.af.database.list("sList");
        this.sList = sListRef.push(list);
        this.sListUsersKey = this.sList.child("users");
        return this.af.database.object("sList/" + this.sList.getKey());
    };
    CreateService.prototype.resetSList = function () {
        this.resetInvitedUsers();
        this.resetMailedUsers;
    };
    CreateService.prototype.resetInvitedUsers = function () {
        this.invitedUsers.length = 0;
    };
    CreateService.prototype.resetMailedUsers = function () {
        this.mailedUsers.length = 0;
    };
    CreateService.prototype.createSListUser = function (usr) {
        console.log(this.sList);
        var sListKey = usr.$key;
        var insertData = {};
        insertData[sListKey] = true;
        var testme = this.af.database.object("sListUsers");
        if (this.invitedUsers.indexOf(usr.$key) < 0) {
            this.invitedUsers.push(usr.$key);
            // this.sListUsersKey.update(this.invitedUsers);
            this.sListUsersRef.child(this.sList.getKey()).update(insertData);
        }
    };
    CreateService.prototype.sendEmailToUser = function (usr) {
        if (this.mailedUsers.indexOf(usr.$key) < 0) {
            this.mailedUsers.push(usr.$key);
            var result = this.http.post('/api/email', usr)
                .map(function (res) { return res.json(); })
                .catch(function (error) { return Observable.throw(error.json().error || 'Server error'); });
            result.subscribe(function (x) { return console.log(x); });
        }
    };
    CreateService.prototype.addtoFirebase = function (element) {
        var users = this.af.database.list("users");
        users.push(element);
    };
    CreateService.prototype.getItemFromFirebase = function (email) {
        var tempUsr;
        var usr = this.af.database.list('users', {
            query: {
                orderByChild: 'email',
                equalTo: email,
                limitToFirst: 1
            }
        }).map(function (x) {
            if (x && x.length > 0) {
                return x[0];
            }
            else {
                return tempUsr;
            }
        });
        return usr;
    };
    CreateService.prototype.addIfNotExists = function (email) {
        var usr = this.af.database.list('users', {
            query: {
                orderByChild: 'email',
                equalTo: email
            }
        });
        return usr;
    };
    CreateService.prototype.getUsers = function () {
        // ...using get request
        var result = this.http.get(this.users)
            .map(function (res) { return res.json(); })
            .catch(function (error) { return Observable.throw(error.json().error || 'Server error'); });
        return result;
    };
    CreateService.prototype.getUsersFirebase = function () {
        var result = this.af.database.list('/users');
        return result;
    };
    CreateService.prototype.createFirebaseCatalog = function (catalog) {
        var addArticle = this.af.database.list("articles");
        var addCatalog = this.af.database.list("catalog/english");
        for (var property in catalog) {
            if (catalog.hasOwnProperty(property)) {
                var insertData = {};
                var myArtcileArr = [];
                var myCatalogObj = {};
                var catalogObj = {};
                catalogObj["name"] = property;
                catalogObj["isDefault"] = true;
                catalogObj["articles"] = [];
                var propertyAdded = addCatalog.push(catalogObj);
                for (var i = 0; i < catalog[property].length; i++) {
                    var val = catalog[property][i];
                    var obj = {
                        name: val,
                        isDefault: true
                    };
                    var articleAdded = addArticle.push(obj);
                    var key = articleAdded.key;
                    insertData[key] = true;
                    var addToCatalog = this.af.database.list("catalog/english/" + propertyAdded.key + "/articles");
                    addToCatalog.push(key);
                    myArtcileArr.push(insertData);
                    catalogObj["articles"].push(key);
                }
            }
        }
    };
    CreateService = __decorate([
        Injectable(),
        __param(0, Inject(FirebaseRef)), 
        __metadata('design:paramtypes', [Object, Http, AngularFire])
    ], CreateService);
    return CreateService;
}());
//# sourceMappingURL=/Users/grubert/WebstormProjects/cas-projekt2.1/src/app/+create/create.service.js.map