import {Component, OnInit, Inject, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import {SharedComponent} from './../../shared/shared.component';
import {ListService} from './../list.service';
import {user} from './../../model/user';

import {Observable} from 'rxjs/Observable';

import {list} from './../../model/user';
import {Subject} from 'rxjs/Subject';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseRef} from 'angularfire2';

declare var PouchDB: any;
const MAX_HITS_DISPLAYED = 30;
const COLOR_CATALOGITEM = '#58c';
const COLOR_INSLIST = '#f44';
const COLOR_INBASKET = '#792';


export class listCatalog {
    constructor(public id?: string,
                public name?: string,
                public articles?: Array<any>) {
    }
}

export class listArticle {
    constructor(public id?: string,
                public name?: string,
                public isInBasket?: boolean,
                public description?: string,
                public amount?: string,
                public price?: string,
                public backGroundColor?: string,
                public img?: string) {
    }
}

@Component({
    selector: 'list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    providers: [ListService]
})

export class ListComponent implements OnInit, OnDestroy {
    private url;
    private sList;
    private user;
    private search;
    db: any;
    clearArticle: any;
    af: AngularFire;
    catalogs: listCatalog[] = [];
    usersCatalogs: listCatalog[] = [];
    searchitems: Observable<Array<string>>;
    articles: Array<any> = [];
    recentArticles: Array<any> = [];
    title: string;
    lang: string;
    searchArticles: Array<any> = [];
    articlesList: Array<listArticle> = [];
    selectedArticleList: listArticle = {};
    private searchTerms = new Subject<string>();

    constructor(af: AngularFire,
                public _listService: ListService,
                private route: ActivatedRoute,
                private router: Router) {
        this.af = af;
        this.db = new PouchDB("sList");
    }

    ngOnDestroy() {
        // document.removeEventListener('tap', this.enter, false);
        console.log("Removed event listener");

    }

    // load initial required data
    ngOnInit() {
        this.user = this.route.params
            .switchMap((params: Params) => {
                // stored in browse db(PouchDB)
                this.url = params['email'];
                this.sList = params['id'];
                // clear articles from Shopping list when true
                this.clearArticle = params['clearArticle'];
                if (params['again'] == "true") {
                    this.af.database.list(`sList/${this.sList}/articles`).remove();
                }
                else if (this.clearArticle == "true") {
                    this.router.navigate([`list/${this.sList}`, {email: this.url, clearArticle: true, again: true}]);
                    window.location.reload();
                }

                // get or add user from/to local database Pouchdb
                this.getOrAddUsernameToLocalDB();
                return Observable.from([1, 2, 3]).map(x => x);
            });
        this.user.subscribe(c => console.log(c));

        // get the List title an the language
        this.getSTitle();
        console.log("init: name="+JSON.stringify(this.articlesList[0]));

        // get all articles for shopping list
        this.getArticleBySlist();
        console.log("init: name="+JSON.stringify(this.articlesList[0]));


        // search article observable
        const search = document.getElementById("listSearch");
        let search$ = Observable.fromEvent(search, "keyup")
            .map((x: any) => x.target.value)
            .map(x => {
                return this.performSearch(x);
            });

        search$.subscribe(x => {
            this.searchArticles = x;
        });

        /// get all articles for search purpose
        this.getAllArticles();

        /// show extra side nav menus
        this.showSideMenu();
    }

    getSTitle() {
        this._listService.getSDetails(this.sList).map(x => x).subscribe(x => {
            this.title = x.title;
            this.lang = (x.language.toLowerCase() == 'English') ? 'en' : 'de';
            console.log("getSTitle: slist title="+this.title+", lang="+this.lang);
            // get catalog based on the user selected shopping list language
            this.getCatalog(this.lang); //x.language.toLowerCase());
            this.getUsersCatalog(this.lang);
        })
    }

    showSideMenu() {
        document.getElementById('edit').style.display = 'block';
        document.getElementById('clear').style.display = 'block';
        document.getElementById('finished').style.display = 'block';
        document.getElementById('delete').style.display = 'block';
    }

    /// get user email from local databas(pouch db)
    getOrAddUsernameToLocalDB() {
        let self = this;
        self.db.allDocs({include_docs: true, descending: true}, function (err, doc) {
            if (err) {
                console.log(err)
                return;
            }
            if (doc.rows.length > 0) {
                //get user from localdb
                self.setLocalUser(doc.rows[0].doc);
            } else {
                //set to local db
                self.addUserToLocalDB();
            }
        });
    }

    setLocalUser(obj) {
        let self = this;
        if (this.url == obj.user) {
            this.db.get(obj._id).then(function (doc) {
                doc.sList = self.sList;
                doc.user = self.url;
                return self.db.put(doc);
            });
        } else {
            this.db.get(obj._id).then(function (doc) {
                doc.user = self.url;
                doc.sList = self.sList;
                return self.db.put(doc);
            });
        }
    }

    addUserToLocalDB() {
        this.db.post({user: this.url});
    }

    // remove accents so we can search for "apfel" and find "äpfel"
    private unaccentedLC(s: string): string {
        if (s) {
            return s.toLowerCase().replace(/[àáâãäå]/g,"a").replace(/ç/g,"c").replace(/[èéêë]/g,"e")
                .replace(/[ìíîï]/g,"i").replace(/ñ/g,"n").replace(/[òóôõö]/g,"o").replace(/[ùúûü]/g,"u")
                .replace(/ß/g,"ss");
        }
        return s;
    }
    // find article from the list of all articles
    performSearch(inp): Array<any> {
        if (!inp || inp.trim() == '') {
            return [];
        }
        for (let i = 0; i < this.articles.length; i++) {
            console.log("ART:"+this.articles[i].name+">");
        }
        let foundArticles = [];
        let foundNames = new Set();
        // first find articles that start with the search string...
        let startsWith = new RegExp("^" + this.unaccentedLC(inp), "i");
        for (let i = 0; i < this.articles.length && foundArticles.length < MAX_HITS_DISPLAYED; i++) {
            let lcName = this.unaccentedLC(this.articles[i].name);
            if (lcName.match(startsWith) && ! foundNames.has(lcName)) {
                foundNames.add(lcName);
                let item = this.articles[i];
                item.backGroundColor = (this.findInListArticles(item.$key)) ? COLOR_INSLIST : COLOR_CATALOGITEM;
                foundArticles.push(this.articles[i]);
            }
        }
        console.log(foundArticles.length+" hits that start with "+inp);
        // if we still don't have enough, also show articles that contain the search string somewhere in the middle
        let contains = new RegExp(this.unaccentedLC(inp), "i"); // \\B is "non-word boundary"
        for (let i = 0; i < this.articles.length && foundArticles.length < MAX_HITS_DISPLAYED; i++) {
            let lcName = this.unaccentedLC(this.articles[i].name);
            if (lcName.match(contains) && ! foundNames.has(lcName)) {
                foundNames.add(lcName);
                let item = this.articles[i];
                item.backGroundColor = (this.findInListArticles(item.$key)) ? COLOR_INSLIST : COLOR_CATALOGITEM;
                foundArticles.push(this.articles[i]);
            }
        }
        console.log(foundArticles.length+" hits that start with or contain "+inp);
        if (foundArticles.length == 0) {
            let art = {
                name: inp,
                'default': false
            };
            foundArticles.push(art);
        }
        return foundArticles;
    }

    // find in articles by key
    findInListArticles(nameKey) {
        let exists = false;
        for (let i = 0; i < this.articlesList.length; i++) {
            if (this.articlesList[i].id === nameKey) {
                exists = true;
            }
        }
        return exists;
    }


    // get all articles
    getAllArticles() {
        let articles$ = this._listService.getAllArticles(this.lang);
        articles$.subscribe(x => {
            this.articles = x;
        });
    }

    // get article by shopping list id
    getArticleBySlist() {
        let articles = this._listService.getArticlesForSlist(this.sList).map(x => x);
        articles.subscribe(x => {
            // debugger
            this.articlesList = [];
            if (x && x.length) {
                for (let i = 0; i < x.length; i++) {
                    // get amount, description etc from the sList
                    let item: listArticle = {};
                    item.id = x[i].id;
                    item.description = x[i].description;
                    item.isInBasket = x[i].isInBasket;
                    item.backGroundColor = (x[i].isInBasket) ? COLOR_INBASKET : COLOR_INSLIST;
                    item.amount = x[i].amount;
                    item.price = x[i].price;
                    this.articlesList.push(item);
                    console.log("SL1: "+JSON.stringify(item));
                    // get name and image from the article catalog
                    let articleDetail = this.af.database.object(`/articlesx/${this.lang}/${x[i].id}`);
                    articleDetail.subscribe(p => {
                        if (p) {
                            for (let j = 0; j < this.articlesList.length; j++) {
                                if (this.articlesList[j].id == p.$key) {
                                    this.articlesList[j].name = p.name; // {de:Öl,en:oil}
                                    this.articlesList[j].img = (p.img) ? p.img : "empty.png";
                                    console.log("SL2: l="+this.lang+" : "+JSON.stringify(this.articlesList[j]));
                                    console.log("SL3: name="+this.articlesList[j].name);
                                }
                            }
                        }
                    });
                }
            }
        })
    }

    // add articles to shopping list
    addToList(item: any) {
        this.recentArticles.push(item);
        this.searchArticles = [];
        this.search = '';
        if (item.$key) {
            this.addArticleToList(item.$key);
        } else {
            // add a new article with the name the user has just given as a search string
            let art = {
                name: item.name,
                img: 'empty.png',
                isDefault: false
            };
            let article$ = this._listService.getArticleByName(art.name, this.lang).map(x => x);
            article$.subscribe(x => {
                if (item) {
                    if (x && x.length > 0) {
                        item.$key = x[0].$key;
                        this.addArticleToList(x[0].$key);
                    } else {
                        this._listService.addArticleAndAddToList(this.sList, art, this.lang);
                    }
                    article$.unsubscribe();
                }
            })
        }
    }

    // add article to shopping list
    addArticleToList(key: string) {
        let art: listArticle = {
            id: key
        };
        this._listService.addArticleToList(this.sList, art);
    }

    // get users catalog (category, articles) user defined
    getUsersCatalog(lang) {
        let self = this;
        let items = this.af.database.list(`/catalogx/${lang}`, {
            query: {
                orderByChild: 'isDefault',
                equalTo: false
            }
        }).map(x => {
            return x;
        }).subscribe(x => {
            let self = this;
            this.usersCatalogs = [];
            if (x != undefined) {
                for (let i = 0; i < x.length; i++) {
                    let item = {
                        name: x[i].name,
                        id: x[i].$key,
                        articles: []
                    };
                    this.usersCatalogs.push(item);
                    for (let property in x[i].articles) {
                        if (x[i].articles.hasOwnProperty(property)) {
                            self.af.database.object(`/articlesx/${lang}/${x[i].articles[property]}`).subscribe(p => {
                                if (!p.img) {
                                    p.img = "empty.png"
                                }
                                this.usersCatalogs[i].articles.push(p);
                            });
                        }
                    }
                }
            }
        });
    }

    // get users catalog (category, articles) default
    getCatalog(lang) {
        let self = this;
        let items = this.af.database.list(`/catalogx/${lang}`, {
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
                            self.af.database.object(`/articlesx/${lang}/${x[i].articles[property]}`).subscribe(p => {
                                if (!p.img) {
                                    p.img = "empty.png"
                                }
                                //debugger;
                                this.catalogs[i].articles.push(p);
                            });
                        }
                    }
                }
            }
        });
    }

    // push article to catalog
    pushToCatalog(item) {
        let updated: boolean = false;
        for (let i = 0; i < this.catalogs.length; i++) {
            if (this.catalogs[i].id == item.id) {
                console.log("pushToCatalog item.name="+JSON.stringify(item.name));
                this.catalogs[i].name = item.name;
                updated = true;
            }
        }
        if (!updated) {
            this.catalogs.push(item);
        }
    }

    // check changeInCatalogs and add to articles
    changeInCatalogs(item, id) {
        for (let i = 0; i <= this.catalogs.length; i++) {
            if (this.catalogs[i] && this.catalogs[i].id == id) {
                let obj: listCatalog = {};
                console.log("changeInCatalog item.name="+JSON.stringify(item.name));
                obj.name = item.name;
                obj.id = item.$key;
                this.pushToArticles(obj, this.catalogs[i].id);
                console.log(this.catalogs);
            }
        }
    }

    // add to category user defined
    pushToUsersCatalog(item) {
        let updated: boolean = false;
        for (let i = 0; i < this.usersCatalogs.length; i++) {
            if (this.usersCatalogs[i].id == item.id) {
                console.log("pushToUsersCatalog item.name="+JSON.stringify(item.name));
                this.usersCatalogs[i].name = item.name;
                updated = true;
            }
        }
        if (!updated) {
            this.usersCatalogs.push(item);
        }

    }

    //check in changeInUsersCatalogs add to articles
    changeInUsersCatalogs(item, id) {
        for (let i = 0; i <= this.catalogs.length; i++) {
            if (this.usersCatalogs[i] && this.usersCatalogs[i].id == id) {
                let obj: listCatalog = {};
                console.log("changeInUsersCatalogs item.name="+JSON.stringify(item.name));
                obj.name = item.name;
                obj.id = item.$key;
                this.pushToUserArticles(obj, this.usersCatalogs[i].id);
            }
        }
    }


    // add to user defined catalogs articles
    pushToUserArticles(item, id) {
        let updated: boolean = false;
        for (let i = 0; i < this.usersCatalogs.length; i++) {
            if (this.usersCatalogs[i].id == id) {
                for (let j = 0; j < this.usersCatalogs[i].articles.length; j++) {
                    if (this.usersCatalogs[i].articles[j].id == item.id) {
                        console.log("pushToUserArticles item.name="+JSON.stringify(item.name));
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

    // add to articles default catalog
    pushToArticles(item, id) {
        let updated: boolean = false;
        for (let i = 0; i < this.catalogs.length; i++) {
            if (this.catalogs[i].id == id) {
                for (let j = 0; j < this.catalogs[i].articles.length; j++) {
                    if (this.catalogs[i].articles[j].id == item.id) {
                        console.log("pushToArticles item.name="+JSON.stringify(item.name));
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


    // toggle catalog ui based on (tap/click ) event
    toggleCatalog(evt) {
        // let parentNode=evt.target.parentElement;
        // let currentEle=parentNode.getElementsByClassName('slist-articles')[0];
        if (evt) {
            evt.style.display = (evt.style.display == 'none') ? 'block' : 'none';
        }
    }

    // selected article to list display box
    selectedArticleInList(a) {
        this.selectedArticleList = a;
        let box: any = document.getElementsByClassName('slist-article-details');
        box[0].style.display = 'block';
    }


    // add article amount
    addArticleAmount(amount) {
        let regex = /(\d+)/g;
        let split = '';
        if (amount == '' || amount === undefined || parseInt(amount) <= 0) {
            this.selectedArticleList.amount = "1";
            return;
        }
        let num = amount.match(regex);
        num = this.getNumberFromString(amount);
        if (num) {
            if (this.isKg(amount)) {
                num = parseFloat(num) + parseFloat("0.1");
                split = amount.split("k");
                this.selectedArticleList.amount = (Math.round(num * 10) / 10) + "k" + split[1].toLowerCase();
            } else if (this.isg(amount)) {
                if (num < 100) {
                    num = parseFloat(num) + parseFloat("10");
                    this.selectedArticleList.amount = (Math.round(num * 10) / 10) + "g";
                } else {
                    num = parseFloat(num) + parseFloat("50");
                    this.selectedArticleList.amount = (Math.round(num * 10) / 10) + "g";
                }
            } else {
                if (amount == '') {
                    this.selectedArticleList.amount = "1";
                }
                this.selectedArticleList.amount = (parseFloat((Math.round(amount * 10) / 10).toString()) + parseFloat("1")).toString();
            }
        }
    }

    // convert to number from string
    getNumberFromString(str) {
        let regex = /[+-]?\d+(\.\d+)?/g;
        let floats = str.match(regex).map(function (v) {
            return parseFloat(v);
        });
        return (floats && floats.length > 0) ? floats[0] : null;
    }

    // reduce article amount size
    reduceArticleAmount(amount) {
        let regex = /(\d+)/g;
        let split = '';
        if (amount == '' || amount === undefined || parseInt(amount) <= 0) {
            return;
        }
        let num;
        num = amount.match(regex);
        num = this.getNumberFromString(amount);

        if (num) {
            if (this.isKg(amount)) {
                num = parseFloat(num) - parseFloat("0.1");
                split = amount.split("k");
                this.selectedArticleList.amount = (Math.round(num * 10) / 10) + "k" + split[1].toLowerCase();
            } else if (this.isg(amount)) {
                if (num < 100) {
                    num = parseFloat(num) - parseFloat("10");
                    this.selectedArticleList.amount = (Math.round(num * 10) / 10) + "g";
                } else {
                    num = parseFloat(num) - parseFloat("50");
                    this.selectedArticleList.amount = (Math.round(num * 10) / 10) + "g";
                }
            } else {
                this.selectedArticleList.amount = (parseFloat((Math.round(amount * 10) / 10).toString()) - parseFloat("1")).toString();
            }
        }
    }

    isKg(amount) {
        return amount.toLowerCase().indexOf('kg') !== -1
    }

    isg(amount) {
        return amount.toLowerCase().indexOf('g') !== -1
    }

    // add to basket
    addToBasket(item) {
        this._listService.addIsInBasket(item.id, this.sList);
        let box: any = document.getElementsByClassName('slist-article-details');
        box[0].style.display = 'none';
    }

    // remove article from shopping list
    removeArticleFromSList(item) {
        this._listService.removeArticleFromSList(item.id, this.sList);
        let box: any = document.getElementsByClassName('slist-article-details');
        box[0].style.display = 'none';
    }

    // update shopping list ui
    updateSList(item) {
        this._listService.updateSList(item, this.sList);
        let box: any = document.getElementsByClassName('slist-article-details');
        box[0].style.display = 'none';
    }
}