import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseRef} from 'angularfire2';
// Import RxJs required methods
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';

import {user, list} from './../model/user';

@Injectable()
export class CreateService {

    private users = '/users';
    af: AngularFire;
    items: FirebaseListObservable<any[]>;
    invitedUsers: Array<any> = [];
    private sList: any;
    private sListUsersKey: any;
    mailedUsers: Array<any> = [];

    constructor(private http: Http, af: AngularFire) {
        this.af = af;
    }

    // get data from an existing shopping list by id
    getSListData(key) {
        return this.af.database.object(`sList/${key}`).map(x => x);
    }

    // create shopping list by id
    createSList(list: list): FirebaseObjectObservable<any> {
        const sListRef = this.af.database.list(`sList`);
        this.sList = sListRef.push(list);
        this.sListUsersKey = this.sList.child("users");

        return this.af.database.object(`sList/${this.sList.getKey()}`);
    }

    // reset invited and emailed users
    resetSList(): void {
        this.invitedUsers.length = 0;
        this.mailedUsers.length = 0;
    }

    //create Shopping list
    createSListUser(usr: any): void {
        let sListKey = usr.$key;
        let insertData = {};
        insertData[sListKey] = true;
        let testme = this.af.database.object(`sListUsers`);
        if (this.invitedUsers.indexOf(usr.$key) < 0) {
            this.invitedUsers.push(usr.$key);
            // this.sListUsersKey.update(this.invitedUsers);
            this.af.database.object(`sListUsers/${this.sList.getKey()}`).update(insertData);
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
        let result = this.http.get(this.users)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
        return result;

    }

    // get all users
    getUsersFirebase(): Observable<any[]> {
        let result = this.af.database.list('/users');
        return result;
    }

    // dump default catalogs with en and de names, articles with imgs
    createFirebaseCatalogx(catalog: Object) {
        if (1 == 1) {
            return
        }
        let langs = ["en", "de"];
        for (let iLang in langs) {
            let lang = langs[iLang];
            const addArticle = this.af.database.list(`articlesx/${lang}`);
            const addCatalog = this.af.database.list(`catalogx/${lang}`);
            for (let property in catalog) {
                if (catalog.hasOwnProperty(property)) {
                    let insertData = {};
                    let myArticleArr = [];
                    let catalogObj = {};
                    let names = property.split("|");
                    catalogObj["name"] = names[iLang];
                    catalogObj["isDefault"] = true;
                    catalogObj["articles"] = [];

                    let propertyAdded = addCatalog.push(catalogObj);

                    // first sort articles alphabetically, depends on language
                    let arts: string[] = [];
                    for (let i = 0; i < catalog[property].length; i++) {
                        let val = catalog[property][i];
                        let articleItems = val.split("|");
                        arts.push(articleItems[iLang] + "|" + articleItems[2]);
                    }
                    // use localeCompare to make sure Äpfel and Öl are sorted correctly
                    arts = arts.sort(function (a, b) {
                        return a.localeCompare(b, lang)
                    });
                    for (let i = 0; i < arts.length; i++) {
                        let articleItems = arts[i].split("|");
                        let img = articleItems[1];
                        if (!img.match(/\.(png|svg|jpg|jpeg|gif)/i)) {
                            img += ".png"
                        }
                        let articleObj = {
                            name: articleItems[0],
                            img: img,
                            isDefault: true
                        };
                        let articleAdded = addArticle.push(articleObj);
                        let key = articleAdded.key;
                        insertData[key] = true;
                        let addToCatalog = this.af.database.list(`catalogx/${lang}/${propertyAdded.key}/articles`)
                        addToCatalog.push(key);
                        myArticleArr.push(insertData);
                        catalogObj["articles"].push(key);
                    }
                }
            }
        }
    }

}