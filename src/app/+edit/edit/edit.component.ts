import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {MdSnackBar} from '@angular/material';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';
import {Observable} from 'rxjs/Observable';
import {TranslateService} from '@ngx-translate/core';

import {SharedComponent} from './../../shared/shared.component';
import {LocalStateService} from './../../services/localstate.service';
import {EditService} from './../edit.service';
import {user} from './../../model/user';
import {list} from './../../model/user';


@Component({
    selector: 'edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss'],
    providers: [EditService, MdSnackBar]
})
export class EditComponent implements OnInit,OnDestroy {
    // shoppingList :list; 
    model = new list(false);
    title: string;
    users = [];
    usersEdit = [];
    af: AngularFire;
    usersFirebase = [];
    inviteUsers: Array<string>;
    emailedUsers: Array<any> = [];
    // languages = ['English', 'German'];
    existingUsers: user[];
    emailAddrs: Array<any> = [];
    sList: FirebaseObjectObservable<any>;
    sListKey: string;
    userKey: string;
    reqSubscribe;
    snackBar;
    db: any;

    constructor(public _editService: EditService,
                private router: Router,
                snackBar: MdSnackBar,
                af: AngularFire,
                private translate: TranslateService) {
        this.router = router;
        this.snackBar = snackBar;
        this.af = af;
    }

    ngOnInit() {
        // get all firebase users
        this.getUsers();
        // get shoppingList details by key
        this.getSId();
        // show menu
        this.showSideMenu();
    }

    // show side menu extas
    showSideMenu() {
        document.getElementById('edit').style.display = 'block';
        document.getElementById('clear').style.display = 'block';
        document.getElementById('finished').style.display = 'block';
        document.getElementById('delete').style.display = 'block';
    }

    getSId() {
        this.userKey = LocalStateService.getUserKey();
        this.sListKey = LocalStateService.getSListKey();
        if (this.sListKey) {
            this.setSid(this.sListKey);
            this.getSIdUsers(this.sListKey);
        }
    }

    // get shoppingList by shoppingList id
    setSid(sListKey) {
        let sListData = this._editService.getSListData(sListKey);
        sListData.subscribe(x => {
            if (x) {
                this.model = x;
            }
        })
        console.log("edit: model="+JSON.stringify(this.model));
    }

    // get shoppingList users by id
    getSIdUsers(obj) {
        let self = this;
        let sListData = this._editService.getSListUsersData(obj);
        sListData.subscribe(x => {
            if (x) {
                this.users = [];
                for (let property in x) {
                    if (x.hasOwnProperty(property)) {
                        if (x[property] == false || x[property] == true) {
                            self.af.database.object(`/users/${property}`).subscribe(p => {
                                //debugger
                                if (p.email != self.model.email)
                                    this.users.push(p.email);
                            });
                        }
                    }
                }
            }
        })
        console.log("edit: users="+JSON.stringify(this.users));
    }

    ngOnDestroy() {
        // this.reqSubscribe.unsubscribe();
    }

    // edit shoppingList
    editList() {
        console.log("Saving edit list: model="+JSON.stringify(this.model));
        // this.model.users.push(this.model.email);
        // this.model.users.push(this.initialEmail);
        this.emailAddrs = [];
        this.inviteUsers = JSON.parse(JSON.stringify(this.users));
        for (let i = 0; i < this.usersEdit.length; i++) {
            this.inviteUsers.push(this.usersEdit[i]);
        }
        this.inviteUsers.push(this.model.email);
        console.log("inviteUsers="+this.inviteUsers);// a simple list of email addr strings, email, initialEmail and moreEmails
        this.CheckUsers();
    }

    // add inviteUsers
    addInvitedUsers() {
        this.usersEdit.push('');
    }

    // angular2 pipe for filtering in ui
    customTrackBy(index: number, obj: any): any {
        return index;
    }


    // check if users exists and edit shoppingList and save users
    CheckUsers() {
        let self = this;
        self.emailedUsers = [];
        for (let i = 0; i < this.inviteUsers.length; i++) {
            if (this.inviteUsers && this.inviteUsers[i] != "") {
                let obj = {
                    email: this.inviteUsers[i]
                };
                self.emailAddrs.push(obj);
            }
        }

        this.model.isFinished = false;
        let sListTemp: list = {
            email: this.model.email,
            isFinished: false,
            description: this.model.description,
            title: this.model.title,
            language: this.translate.currentLang,
            name: this.model.name,
            siteUrl: window.location.origin
        };
        console.log("Saving edit list 2: model="+JSON.stringify(sListTemp));

        self._editService.editSList(self.sListKey, sListTemp);

        self._editService.resetSList();
        let request$ = Observable.from(this.emailAddrs)
            .mergeMap(data => {
                return this.addUserIfNotExists(data);
            })
            .mergeMap(data => {
                return this.getUserObjs(data);
            })
            .map(data => {
                this.createSListUser(data);
                return this.sendKeys(data);
            });
        self.router.navigate([`list/${self.sListKey}`, {email: this.userKey}]);

        // TODO: don't understand what's going on here - aka
        // this.reqSubscribe = request$.subscribe(
        //     val => {
        //         if (val) {
        //             self.emailedUsers.push(val);
        //             if (self.emailedUsers.length == self.inviteUsers.length) {
        //                 if (self.sList) {
        //                     debugger
        //                     let userEmailKey = self.emailedUsers.find(self.findUserEmailKey, self);
        //                     self.router.navigate([`list/${self.sListKey}`, {email: userEmailKey.$key}])
        //                 }
        //             }
        //         }
        //         console.log(val);
        //     }
        // );

        // if (!window.navigator.onLine)
        // {
        //     self.snackBar.open('Shopping List will be Created and email will be sent, once device comes online, Don\'t close the Browser', 'Okay');
        // }

    }

    // find user email by key
    findUserEmailKey(item: any): boolean {
        return item.email == this.model.email;
    }

    // send email by keys
    sendKeys(data: any): Observable<any> {
        return data;
    }

    // send email (not used)
    sendEmail(usr: any): void {
        if (usr) {
            this._editService.sendEmailToUser(usr);
        }
    }

    // create shopping list user
    createSListUser(usr): void {
        if (usr) {
            this._editService.createSListUser(usr);
            console.log(usr);
        }
    }

    // get users 
    getUserObjs(usr: user): Observable<user> {
        let self = this;
        return self._editService.getUserFromFirebase(usr.email)
            .map(x => x);
    }

    // add if users not exists
    addUserIfNotExists(usr: user): Observable<user> {
        let self = this;
        let exists = self.usersFirebase.filter((item) => item.email == usr.email);
        if (exists && exists.length > 0) {
        }
        else {
            self._editService.addUserToFirebase(usr);
        }
        let arr = [];
        arr.push(usr);
        return Observable.from(arr);
    }

    // get users
    getUsers() {
        this._editService.getUsersFirebase()
            .subscribe(
                users => {
                    this.usersFirebase = users;
                }, //Bind to view
                err => {
                    // Log errors if any
                    console.log(err);
                });
    }

    // remove users from shopping list
    removeFromSListUsers(item) {
        let id = this._editService.getIdFromEmail(item);
        id.subscribe(x => {
            if (x && x.length > 0) {
                let removeId = this._editService.removeUserFromsListUsers(x[0].$key);
            }
        })
    }

    // cancel redirect to lists selection (should maybe go to 'list')
    cancelList() {
        this.router.navigate(['lists']);
    }

}