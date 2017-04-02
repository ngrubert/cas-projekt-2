import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseRef} from 'angularfire2';
// Import RxJs required methods
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';

import {user, list} from './../model/user';

@Injectable()
export class EditService {

    private users = '/users';
    af: AngularFire;

    items: FirebaseListObservable<any[]>;
    invitedUsers: Array<any> = [];
    private sList: any;
    private sListKey: any;
    private sListUsersKey: any;
    mailedUsers: Array<any> = [];

    constructor(private http: Http, af: AngularFire) {
        this.af = af;

    }

    // edit shopping list by id
    editSList(key, list: list) {
        const sListRef = this.af.database.object(`sList/${key}`);
        this.sListKey = key;
        sListRef.update(list);
    }

    // reset invited and emailed users
    resetSList(): void {
        this.invitedUsers.length = 0;
        this.mailedUsers.length = 0;
    }

    //create Shopping list
    createSListUser(usr: any): void {
        let userKey = usr.$key;
        let insertData = {};
        insertData[userKey] = true;
        let testme = this.af.database.object(`sListUsers`);
        if (this.invitedUsers.indexOf(usr.$key) < 0) {
            this.invitedUsers.push(usr.$key);
            // this.sListUsersKey.update(this.invitedUsers);
            let dataExists = this.af.database.list(`sListUsers/${this.sListKey}`).map(x => x)
                .subscribe(x => {
                    // debugger
                    if (x && x.length > 0) {
                        let exists = false;
                        for (let i = 0; i < x.length; i++) {
                            if (x[i].$key == userKey) {
                                exists = true;
                            }
                        }
                        if (!exists)
                            this.af.database.object(`sListUsers/${this.sListKey}`).update(insertData);
                        dataExists.unsubscribe();
                    }
                })
            // this.af.database.object(`sListUsers/${this.sListKey}`).update(insertData);
            // this.sendEmailToUser(usr.$key);
        }
    }

    // send email to user (not used)
    sendEmailToUser(usr: any): void {
        if (this.mailedUsers.indexOf(usr.$key) < 0) {
            this.mailedUsers.push(usr.$key);
            let result = this.http.post('/api/email', usr)
                .map((res: Response) => res.json())
                .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
            result.subscribe(x => console.log(x));
        }
    }

    // add user to users collection
    addUserToFirebase(element: user): void {
        const users = this.af.database.list(`users`);
        users.push(element);
    }

    //get user by email
    getUserFromFirebase(email: string): Observable<user> {
        let tempUsr: user;
        const usr = this.af.database.list('users', {
            query: {
                orderByChild: 'email',
                equalTo: email,
                limitToFirst: 1
            }
        }).map(x => {
            if (x && x.length > 0) {
                return x[0];
            } else {
                return tempUsr;
            }
        });
        return usr;
    }

    //add id user not exists
    addUserIfNotExists(email: string): Observable<user[]> {
        const usr = this.af.database.list('users', {
            query: {
                orderByChild: 'email',
                equalTo: email
            }
        });
        return usr;
    }


    getUsers(): Observable<user[]> {
        // ...using get request
        var result = this.http.get(this.users)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
        return result;

    }

    // get all users
    getUsersFirebase(): Observable<any[]> {
        var result = this.af.database.list('/users');
        return result;
    }

    // get shopping list by id
    getSListData(id) {
        this.sListKey = id;
        return this.af.database.object(`sList/${id}`).map(x => x);
    }

    //get shopping list users by id
    getSListUsersData(id) {
        return this.af.database.object(`sListUsers/${id}`).map(x => x);
    }

    // get userid by email
    getIdFromEmail(email) {
        return this.af.database.list(`users`, {
            query: {
                orderByChild: 'email',
                equalTo: email
            }
        }).map(x => x);
    }

    //remove users from list
    removeUserFromsListUsers(key) {
        let item = this.af.database.object(`sListUsers/${this.sListKey}/${key}`);
        item.remove();
    }

}