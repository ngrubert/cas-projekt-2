import {Injectable, Inject, OnInit}     from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {AngularFire, FirebaseListObservable, FirebaseRef} from 'angularfire2';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

import {user, list} from './../model/user';

@Injectable()
export class ManageService {
    af: AngularFire;
    items: FirebaseListObservable<any[]>;
    private url;
    private user;
    private sId;
    private myUsers;
    private lang: string;


    constructor(private http: Http,
                af: AngularFire,
                private router: Router,
                private route: ActivatedRoute,
                private translate: TranslateService) {
        this.af = af;
        // this.getAllRelatedUsers();
        this.user = this.route.params
            .switchMap((params: Params) => {
                this.url = params['email'];
                this.sId = params['id'];
                return Observable.from([1, 2, 3]).map(x => x);
            });
        // this.user.subscribe(c=>{
        //     this.syncChanges();
        // });
        this.lang = translate.currentLang;

    }

    // these are unused in manage
    // // get article by id
    // getArticles(data, lang: string): any {
    //     return this.af.database.object(`/articles/${this.lang}/${data}`).subscribe(x => x);
    // }
    //
    // // get all articles
    // getAllArticles(lang: string): Observable<any> {
    //     let items = this.af.database.list(`/articlesx/${this.lang}`)
    //         .map(x => x);
    //     return items;
    // }
    //
    // //search article by value
    // searchArticles(val: string): Observable<any> {
    //
    //     return this.af.database.list('articles', {
    //         query: {
    //             orderByChild: '$value',
    //             equalTo: val
    //         }
    //     })
    // }

    // get all categories by user both german and english
    getAllCategoriesForUser(user: string): Observable<any> {
        let english = this.af.database.list('/catalog/english', {
            query: {
                orderByChild: `users/${user}`,
                equalTo: true
            }
        }).map(x => {
            for (let i = 0; i < x.length; i++) {
                x[i].language = 'english';
            }
        });
        let german = this.af.database.list('/catalog/german', {
            query: {
                orderByChild: `users/${user}`,
                equalTo: true
            }
        }).map(x => {
            for (let i = 0; i < x.length; i++) {
                x[i].language = 'english';
            }
        });
        return english.concat(german);
    }

    // add category from manage component
    addCategory(obj: Object): void {

        let categories = this.af.database.list(`/catalogx/${this.lang}`);
        let categoryAdded = categories.push(obj);
        let addToCatalog = this.af.database.object(`catalogx/${this.lang}/${categoryAdded.key}/users`);
        this.getAllRelatedUsers(categoryAdded.key);

    }

    // edit category
    editCategory(obj: any, catId: string): void {
        let categories = this.af.database.object(`/catalogx/${this.lang}/${catId}`);
        let categoryAdded = categories.update({name: obj.name, order: obj.order});
        let addToCatalog = this.af.database.object(`catalogx/${this.lang}/${catId}/users`);
        this.getAllRelatedUsers(catId);

    }

    // get category by id
    getCategoryById(id: string): Observable<any> {
        let category = this.af.database.object(`catalogx/${this.lang}/${id}`).map(x => x);
        return category;
    }

    // get article by name (exists or not)
    checkArticleExists(obj): Observable<any> {
        let article = this.af.database.list(`articlesx/${this.lang}`, {
            query: {
                orderByChild: 'name',
                equalTo: obj
            }
        }).map(x => x);
        return article;
    }


    // add article to category
    addArticleToCategory(key: string, catKey: string): void {
        if (key) {
            let addArticleToCategory = this.af.database.list(`catalogx/${this.lang}/${catKey}/articles`);
            let checkArticleInCategory = this.af.database.list(`catalogx/${this.lang}/${catKey}/articles`).map(x => {
                let exists = false;
                for (let i = 0; i < x.length; i++) {
                    if (x[i].$value == key) {
                        exists = true;
                    }
                }
                return exists;
            })

            checkArticleInCategory.subscribe(x => {
                if (!x) {
                    addArticleToCategory.push(key);
                }
            });
        }
    }


    // add article
    //add article id to category
    addArticleAndAddToCategory(obj, catId) {
        let addArticle = this.af.database.list(`articles/${this.lang}`);
        let articleAdded = addArticle.push(obj);
        let key = articleAdded.key;
        this.addArticleToCategory(key, catId);
    }

    // add article
    addArticle(obj) {
        let addArticle = this.af.database.list(`articles/${this.lang}`);
        let articleAdded = addArticle.push(obj);
    }

    // get article by id
    getArticle(id): Observable<any> {
        return this.af.database.object(`articles/${this.lang}/${id}`);
    }

    // remove article id from category
    removeArticleFromCategory(artId, catId) {

        //check if article exists in articles collection
        let removeFromCategory = this.af.database.list(`catalogx/${this.lang}/${catId}/articles`).map(x => {
            let val = '';
            for (let i = 0; i < x.length; i++) {
                if (x[i].$value == artId) {
                    // debugger;
                    val = x[i].$key;
                }
            }
            return val;
        })

        removeFromCategory.subscribe(x => {
            if (x != '') {
                this.af.database.object(`catalogx/${this.lang}/${catId}/articles/${x}`).remove();
            }
        })
    }

    // delete category by lanaguage and id
    deleteCategory(id) {
        let category = this.af.database.object(`catalogx/${this.lang}/${id}`);
        category.remove();
    }

    // get all related users by language from category
    getAllRelatedUsers(catId) {
        let addToCatalog = this.af.database.object(`catalogx/${this.lang}/${catId}/users`)
        let sListUsers = this.af.database.list('sList').map(x => {
            return this.getRelatedUsers(x);
        });
        sListUsers.subscribe(x => {
            this.myUsers = [];
            if (x && x.length > 0) {
                this.myUsers = x;
                this.myUsers.forEach(function (item) {
                    let obj: any = {};
                    obj[item] = true;
                    addToCatalog.update(obj);
                });
            }
        })
    }

    // related users mapping
    getRelatedUsers(x): Array<any> {
        let arr = [];
        let arrFinal = [];
        let arrMap = x.map(function (item) {
            return item.users
        });
        for (let i = 0; i < arrMap.length; i++) {
            if (arrMap[i]) {
                if (arrMap[i].includes(this.url)) {
                    arr.push(arrMap[i]);
                }
            }
        }
        for (let j = 0; j < arr.length; j++) {
            for (let k = 0; k < arr[j].length; k++) {
                arrFinal.push(arr[j][k]);
            }
        }

        return arrFinal.filter((v, i, a) => a.indexOf(v) === i);
        ;
    }
}