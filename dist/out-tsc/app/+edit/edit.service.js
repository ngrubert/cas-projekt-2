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
export var EditService = (function () {
    function EditService(fb, http, af) {
        this.fb = fb;
        this.http = http;
        this.users = '/users';
        this.invitedUsers = [];
        this.mailedUsers = [];
        this.af = af;
        this.roorRef = fb.database().ref('users');
        this.sListUsersRef = fb.database().ref('sListUsers');
    }
    EditService.prototype.editSList = function (key, list) {
        var sListRef = this.af.database.object("sList/" + key);
        sListRef.update(list);
    };
    EditService.prototype.resetSList = function () {
        this.resetInvitedUsers();
        this.resetMailedUsers;
    };
    EditService.prototype.resetInvitedUsers = function () {
        this.invitedUsers.length = 0;
    };
    EditService.prototype.resetMailedUsers = function () {
        this.mailedUsers.length = 0;
    };
    EditService.prototype.createSListUser = function (usr) {
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
    EditService.prototype.sendEmailToUser = function (usr) {
        if (this.mailedUsers.indexOf(usr.$key) < 0) {
            this.mailedUsers.push(usr.$key);
            var result = this.http.post('/api/email', usr)
                .map(function (res) { return res.json(); })
                .catch(function (error) { return Observable.throw(error.json().error || 'Server error'); });
            result.subscribe(function (x) { return console.log(x); });
        }
    };
    EditService.prototype.addtoFirebase = function (element) {
        var users = this.af.database.list("users");
        users.push(element);
    };
    EditService.prototype.getItemFromFirebase = function (email) {
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
    EditService.prototype.addIfNotExists = function (email) {
        var usr = this.af.database.list('users', {
            query: {
                orderByChild: 'email',
                equalTo: email
            }
        });
        return usr;
    };
    EditService.prototype.getUsers = function () {
        // ...using get request
        var result = this.http.get(this.users)
            .map(function (res) { return res.json(); })
            .catch(function (error) { return Observable.throw(error.json().error || 'Server error'); });
        return result;
    };
    EditService.prototype.getUsersFirebase = function () {
        var result = this.af.database.list('/users');
        return result;
    };
    EditService.prototype.createFirebaseCatalog = function (catalog) {
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
    EditService.prototype.getSListData = function (id) {
        return this.af.database.object("sList/" + id).map(function (x) { return x; });
    };
    EditService.prototype.getSListUsersData = function (id) {
        return this.af.database.object("sListUsers/" + id).map(function (x) { return x; });
    };
    EditService = __decorate([
        Injectable(),
        __param(0, Inject(FirebaseRef)), 
        __metadata('design:paramtypes', [Object, Http, AngularFire])
    ], EditService);
    return EditService;
}());
//# sourceMappingURL=/Users/grubert/WebstormProjects/cas-projekt2.1/src/app/+edit/edit.service.js.map