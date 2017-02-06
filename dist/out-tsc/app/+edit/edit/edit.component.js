var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { EditService } from './../edit.service';
import { Observable } from 'rxjs/Observable';
import { list } from './../../model/user';
import { AngularFire } from 'angularfire2';
export var EditComponent = (function () {
    function EditComponent(_editService, router, snackBar, af) {
        this._editService = _editService;
        this.router = router;
        // shoppingList :list; 
        this.model = new list(false);
        this.users = [];
        this.usersFirebase = [];
        this.emailedUsers = [];
        this.languages = ['English', 'German'];
        this.array = [];
        this.router = router;
        this.snackBar = snackBar;
        this.db = new PouchDB("sList");
        this.af = af;
    }
    EditComponent.prototype.ngOnInit = function () {
        this.getUsers();
        this.getSId();
        this.showSideMenu();
    };
    EditComponent.prototype.showSideMenu = function () {
        document.getElementById('edit').style.display = 'block';
        document.getElementById('clear').style.display = 'block';
        document.getElementById('finished').style.display = 'block';
        document.getElementById('delete').style.display = 'block';
    };
    EditComponent.prototype.getSId = function () {
        var self = this;
        this.db.allDocs({ include_docs: true, descending: true }, function (err, docs) {
            if (err) {
                console.log(err);
                return err;
            }
            if (docs && docs.rows.length > 0) {
                self.sList = docs.rows[0].doc.sList;
                self.setSid(docs.rows[0].doc);
                self.getSIdUsers(docs.rows[0].doc);
            }
        });
    };
    EditComponent.prototype.setSid = function (obj) {
        var _this = this;
        var sListData = this._editService.getSListData(obj.sList);
        sListData.subscribe(function (x) {
            if (x) {
                _this.model = x;
            }
        });
    };
    EditComponent.prototype.getSIdUsers = function (obj) {
        var _this = this;
        var self = this;
        var sListData = this._editService.getSListUsersData(obj.sList);
        sListData.subscribe(function (x) {
            if (x) {
                for (var property in x) {
                    if (x.hasOwnProperty(property)) {
                        self.af.database.object("/users/" + property).subscribe(function (p) {
                            debugger;
                            if (p.email != self.model.email)
                                _this.users.push(p.email);
                        });
                    }
                }
            }
        });
    };
    EditComponent.prototype.ngOnDestroy = function () {
        // this.reqSubscribe.unsubscribe();
    };
    EditComponent.prototype.EditList = function () {
        console.log(this.model);
        // this.model.users.push(this.model.email);
        // this.model.users.push(this.initialEmail);
        this.array = [];
        this.inviteUsers = JSON.parse(JSON.stringify(this.users));
        console.log(this.inviteUsers);
        this.CheckUsers();
    };
    EditComponent.prototype.addInvitedUsers = function () {
        this.users.push('');
    };
    EditComponent.prototype.customTrackBy = function (index, obj) {
        return index;
    };
    EditComponent.prototype.ItemNotIn = function (obj) {
        var exists = this.exists.filter(function (item) {
            return item.email === obj.email;
        });
        if (exists && exists.length > 0) {
            return false;
        }
        else {
            return true;
        }
    };
    EditComponent.prototype.CheckUsers = function () {
        var _this = this;
        var self = this;
        self.emailedUsers = [];
        for (var i = 0; i < this.inviteUsers.length; i++) {
            if (this.inviteUsers && this.inviteUsers[i] != "") {
                var obj = {
                    email: this.inviteUsers[i]
                };
                self.array.push(obj);
            }
        }
        this.model.isFinished = false;
        var sListTemp = this.model;
        sListTemp.users = [];
        var sListCreated$ = self._editService.editSList(this.sList, sListTemp);
        self._editService.resetSList();
        var request$ = Observable.from(this.array)
            .mergeMap(function (data) {
            return _this.addIfnotExists(data);
        })
            .mergeMap(function (data) {
            return _this.getUserObjs(data);
        })
            .map(function (data) {
            _this.createSListUser(data);
            return _this.sendKeys(data);
        });
        // .map(data=>{
        //     this.sendEmail(data);
        //     return this.sendKeys(data);
        // });
        this.reqSubscribe = request$.subscribe(function (val) {
            if (val) {
                self.emailedUsers.push(val);
                if (self.emailedUsers.length == self.inviteUsers.length) {
                    if (self.sList) {
                        var userEmailKey = self.emailedUsers.find(self.findUserEmailKey, self);
                        self.router.navigate([("list/" + self.sListKey), { email: userEmailKey.$key }]);
                    }
                }
            }
            console.log(val);
        });
        // if(!window.navigator.onLine)
        // {
        //     self.snackBar.open('Shopping List will be Created and email will be sent, once device comes online, Don\'t close the Browser', 'Okay');
        // }
    };
    EditComponent.prototype.findUserEmailKey = function (item) {
        return item.email == this.model.email;
    };
    EditComponent.prototype.sendKeys = function (data) {
        return data;
    };
    EditComponent.prototype.sendEmail = function (usr) {
        if (usr) {
            this._editService.sendEmailToUser(usr);
        }
    };
    EditComponent.prototype.createSListUser = function (usr) {
        if (usr) {
            this._editService.createSListUser(usr);
            console.log(usr);
        }
    };
    EditComponent.prototype.getUserObjs = function (usr) {
        var self = this;
        return self._editService.getItemFromFirebase(usr.email)
            .map(function (x) { return x; });
    };
    EditComponent.prototype.addIfnotExists = function (usr) {
        var self = this;
        var exists = self.usersFirebase.filter(function (item) { return item.email == usr.email; });
        if (exists && exists.length > 0) { }
        else {
            self._editService.addtoFirebase(usr);
        }
        var arr = [];
        arr.push(usr);
        return Observable.from(arr);
    };
    EditComponent.prototype.getUsers = function () {
        var _this = this;
        this._editService.getUsersFirebase()
            .subscribe(function (users) {
            _this.usersFirebase = users;
        }, //Bind to view
        function (//Bind to view
            err) {
            // Log errors if any
            console.log(err);
        });
    };
    EditComponent = __decorate([
        Component({
            selector: 'edit',
            templateUrl: './edit.component.html',
            styleUrls: ['./edit.component.scss'],
            providers: [EditService, MdSnackBar]
        }), 
        __metadata('design:paramtypes', [EditService, Router, MdSnackBar, AngularFire])
    ], EditComponent);
    return EditComponent;
}());
//# sourceMappingURL=/Users/grubert/WebstormProjects/cas-projekt2.1/src/app/+edit/edit/edit.component.js.map