import {Component, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

import {SharedComponent} from './../../shared/shared.component';
import {ManageService} from './../manage.service';
import {user} from './../../model/user';

import {Observable} from 'rxjs/Observable';

import {list} from './../../model/user';
import {Subject} from 'rxjs/Subject';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseRef} from 'angularfire2';
export class catalog {
    constructor(public id?: string,
                public name?: string,
                public articles?: Array<any>) {
    }
}

@Component({
    selector: 'manage',
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss'],
    providers: [ManageService]
})

export class ManageComponent implements OnInit {
    private url;
    private user;
    af: AngularFire;
    catalogs: catalog[] = [];
    usersCatalogs: catalog[] = [];
    searchitems: Observable<Array<string>>;
    articles: Array<any> = [];
    lang: string;
    searchArticles: Array<any> = [];
    private searchTerms = new Subject<string>();

    constructor(af: AngularFire,
                public _manageService: ManageService,
                private route: ActivatedRoute,
                private router: Router,
                private translate: TranslateService) {
        this.af = af;
        this.lang = translate.currentLang;
    }

    ngOnInit() {
        this.user = this.route.params
            .switchMap((params: Params) => {
                // this.url = '-K_PcS3U-bzP0Jgye_Xo';
                return Observable.from([1, 2, 3]).map(x => x);
            });
        // this.user.subscribe(x => {
        //     this.syncChanges();
        // });
        this.getCatalog();
    }

    // unused
    // // get all articles
    // getAllArticles() {
    //     let articles$ = this._manageService.getAllArticles();
    //     articles$.subscribe(x => {
    //         this.articles = x;
    //     });
    // }


    // get users from catalog by language english and german (user defined)
    getUsersCatalog() {
        let self = this;
        let englishitems = this.af.database.list(`/catalogx/${this.lang}`, {
            query: {
                orderByChild: 'isDefault',
                equalTo: false
            }
        }).map(x => {
            for (let i = 0; i < x.length; i++) {
                x[i].language = 'english';
            }
            return x;
        });
        let germanitems = this.af.database.list('/catalogx/de', {
            query: {
                orderByChild: 'isDefault',
                equalTo: false
            }
        }).map(x => {
            for (let i = 0; i < x.length; i++) {
                x[i].language = 'german';
            }
            return x;
        });

        englishitems.concat(germanitems).subscribe(x => {
            let self = this;
            this.usersCatalogs = [];
            if (x != undefined) {
                for (let i = 0; i < x.length; i++) {
                    let item = {
                        name: x[i].name,
                        id: x[i].$key,
                        language: x[i].language,
                        articles: []
                    };
                    this.usersCatalogs.push(item);
                    for (let property in x[i].articles) {
                        if (x[i].articles.hasOwnProperty(property)) {
                            self.af.database.object(`/articlesx/${this.lang}/${x[i].articles[property]}`).subscribe(x => {
                                this.usersCatalogs[i].articles.push(x);
                            });
                        }
                    }
                }
            }
        });
    }

    // get users from catalog by language english and german (default)
    getCatalog() {
        let self = this;
        let items = this.af.database.list(`/catalogx/${this.lang}`, {
            query: {
                orderByChild: 'isDefault',
                equalTo: true
            }
        }).map(x => {
            return x.sort(function (a, b) {
                let keyA = a.order,
                    keyB = b.order;
                // Compare the 2 dates
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
            });
        }).subscribe(x => {
            let self = this;
            this.catalogs = [];
            if (x != undefined) {
                for (let i = 0; i < x.length; i++) {
                    let item = {
                        name: x[i].name,
                        articles: []
                    };
                    this.catalogs.push(item);
                    for (let property in x[i].articles) {
                        if (x[i].articles.hasOwnProperty(property)) {
                            self.af.database.object(`/articlesx/${this.lang}/${x[i].articles[property]}`).subscribe(p => {
                                if (!p.img) {
                                    p.img = "empty.png"
                                }
                                this.catalogs[i].articles.push(p);
                            });
                        }
                    }
                }
            }
        });
    }

    // add to catalog
    pushToCatalog(item) {
        let updated: boolean = false;
        for (let i = 0; i < this.catalogs.length; i++) {
            if (this.catalogs[i].id == item.id) {
                this.catalogs[i].name = item.name;
                updated = true;
            }
        }
        if (!updated)
            this.catalogs.push(item);

    }

    // catalog mapping (user defined)
    changeInCatalogs(item, id) {
        for (let i = 0; i <= this.catalogs.length; i++) {
            if (this.catalogs[i] && this.catalogs[i].id == id) {
                let obj: catalog = {};
                obj.name = item.name;
                obj.id = item.$key;
                this.pushToArticles(obj, this.catalogs[i].id);
            }
        }
    }

    pushToUsersCatalog(item) {
        let updated: boolean = false;
        for (let i = 0; i < this.usersCatalogs.length; i++) {
            if (this.usersCatalogs[i].id == item.id) {
                this.usersCatalogs[i].name = item.name;
                this.usersCatalogs[i].id = item.id;
                updated = true;
            }
        }
        if (!updated)
            this.usersCatalogs.push(item);

    }

    // catalog mapping (default)
    changeInUsersCatalogs(item, id) {
        for (let i = 0; i <= this.catalogs.length; i++) {
            if (this.usersCatalogs[i] && this.usersCatalogs[i].id == id) {
                let obj: catalog = {};
                obj.name = item.name;
                obj.id = item.$key;
                this.pushToUserArticles(obj, this.usersCatalogs[i].id);
            }
        }
    }

    // catalog article mapping (user defined)
    pushToUserArticles(item, id) {
        let updated: boolean = false;
        for (let i = 0; i < this.usersCatalogs.length; i++) {
            if (this.usersCatalogs[i].id == id) {
                for (let j = 0; j < this.usersCatalogs[i].articles.length; j++) {
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
    }

    // catalog article mapping (default)
    pushToArticles(item, id) {
        let updated: boolean = false;
        for (let i = 0; i < this.catalogs.length; i++) {
            if (this.catalogs[i].id == id) {
                for (let j = 0; j < this.catalogs[i].articles.length; j++) {
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
    }

    // toggle catalog on ui based on user interaction (tap/click events)
    toggleCatalog(evt) {
        // let parentNode=evt.target.parentElement;
        // let currentEle=parentNode.getElementsByClassName('slist-articles')[0];
        if (evt) {
            evt.style.display = (evt.style.display == 'none') ? 'block' : 'none';
        }
    }

    // delete article
    deleteArticle(artId, catId) {
        this._manageService.removeArticleFromCategory(artId, catId);
    }

    // show delete ui
    showDelete(deleteButton, deleteArticle) {
        deleteButton.style.display = 'none';
        deleteArticle.style.display = 'block';
    }

    // hide delete option
    hideDelete(deleteButton, deleteArticle) {
        deleteButton.style.display = 'flex';
        deleteArticle.style.display = 'none';
    }
}