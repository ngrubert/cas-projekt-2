import {Component, OnInit, Inject} from '@angular/core';
import {SharedComponent} from './../shared/shared.component';
import {Observable} from 'rxjs/Observable';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseRef} from 'angularfire2';
import {Router, ActivatedRoute, Params} from '@angular/router';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';

import {UsersService} from './../services/users.service';
import {LocalStateService} from './../services/localstate.service';
import {user} from './../model/user';
import {ListsService} from './lists.service';

@Component({
    selector: 'lists',
    templateUrl: './lists.component.html',
    styleUrls: ['./lists.component.scss'],
    providers: [ListsService]
})
export class ListsComponent implements OnInit {
    private abtusers: user[];
    private name;
    private email;
    public /*private*/ sLists = [];
    private url;
    sListsEmpty: Boolean;
    af: any;

    constructor(public _listservice: ListsService,
                af: AngularFire,
                private route: ActivatedRoute,
                private router: Router) {
        this.af = af;
        this.url = LocalStateService.getUserKey();
        // if we don't have a user, we cannot get a list of his shopping lists
        this.sListsEmpty = (this.url == null);
    }

    ngOnInit() {
        this.sLists = [];
        this.getAllLists();
    }

    // button: search sLists based on name and email id
    searchSLists() {
        let self = this;
        this.af.database.list(`users`, {
            query: {
                orderByChild: `email`,
                equalTo: this.email
            }
        }).map(x => x).subscribe(p => {
            if (p && p.length > 0) {
                self.url = p[0].$key;
                self.getAllLists();
            }
        })
    }

    // get all list and map user shopping lists
    getAllLists() {
        let self = this;
        let sListUsers = this._listservice.getSListUsers()
            .subscribe(x => {
                self.sLists = [];
                if (!self.url) {
                    this.sListsEmpty = true;
                } else if (x && x.length > 0) {
                    this.sListsEmpty = false;
                    for (let i = 0; i < x.length; i++) {
                        for (let property in x[i]) {
                            if (x[i].hasOwnProperty(property)) {
                                if (x[i][property].toString() == "true"
                                    || x[i][property].toString() == "false") {
                                    if (property == self.url) {
                                        self.af.database.object(`sList/${x[i].$key}`).map(x => x)
                                            .subscribe(x => {
                                                if (x && x.title !== undefined) {
                                                    this.sLists.push(x);
                                                    //console.log("sLists:"+JSON.stringify(this.sLists));
                                                }
                                            })
                                    }
                                }
                            }
                        }
                    }
                } else {
                    this.sListsEmpty = true;
                }
                sListUsers.unsubscribe();
            })
    }

    // user is known, store the selected list in local DB and go to shopping list page on click
    goToSlist(item) {
        LocalStateService.setUserKey(this.url);
        LocalStateService.setSListKey(item.$key);
        this.router.navigate(['list', item.$key, {email: this.url}]);
    }

    // Button: create new shopping list -- go to create page
    createNewList() {
        this.router.navigate(['create']);
    }

}