import {Component, OnInit, Inject, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseRef} from 'angularfire2';
import {TranslateService} from "@ngx-translate/core";
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

import {SharedComponent} from './../../shared/shared.component';
import {LocalStateService} from './../../services/localstate.service';
import {ListService} from './../list.service';
import {user} from './../../model/user';
import {list} from './../../model/user';

const MAX_HITS_DISPLAYED = 30;
const COLOR_CATALOGITEM = '#58c';
const COLOR_INSLIST = '#e33'; //'#f44';
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
    private email;
    private sList;
    private user;
    public /*private*/ search;
    private detailBox;
    clearArticle: any;
    af: AngularFire;
    catalogs: listCatalog[] = [];
    usersCatalogs: listCatalog[] = [];
    searchitems: Observable<Array<string>>;
    articles: Array<any> = [];
    recentArticles: Array<any> = [];
    //title: string;
    slistLang: string;
    searchArticles: Array<any> = [];
    articlesList: Array<listArticle> = [];
    selectedArticleList: listArticle = {};
    selectedArticleElement: any;
    private searchTerms = new Subject<string>();

    constructor(af: AngularFire,
                public _listService: ListService,
                private route: ActivatedRoute,
                private router: Router,
                private translate: TranslateService) {
        this.af = af;
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
                this.email = params['email'];
                this.sList = params['id'];
                // clear articles from Shopping list when true
                this.clearArticle = params['clearArticle'];
                if (params['again'] == "true") {
                    this.af.database.list(`sList/${this.sList}/articles`).remove();
                } else if (this.clearArticle == "true") {
                    this.router.navigate([`list/${this.sList}`, {email: this.email, clearArticle: true, again: true}]);
                    window.location.reload();
                }

                // get or add user from/to local database Pouchdb
                console.log("list: LocalState: setting both from params");
                LocalStateService.setUserKey(this.email);
                LocalStateService.setSListKey(this.sList);
                return Observable.from([1, 2, 3]).map(x => x);
            });

        this.user.subscribe(c => console.log(c));

        this.slistLang = "de";

        // get all articles for shopping list
        this.getArticleBySlist();
        console.log("init: name=" + JSON.stringify(this.articlesList[0]));

        this.detailBox = document.getElementsByClassName('slist-article-details')[0];

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

        // get the List title and the list language
        this.getSTitle();

        // let lang = LocalStateService.getLanguage();
        // console.log("local="+lang+", slist="+this.slistLang);
        // if (this.slistLang) {
        //     if (lang && lang != this.slistLang) {
        //         this.translate.use(this.slistLang);
        //         LocalStateService.setLanguage(this.slistLang);
        //         window.location.reload();
        //     }
        // } else {
        //     this.slistLang = lang;
        // }

        // get catalog based on the user selected shopping list language
        this.getCatalog(this.slistLang);
        this.getUsersCatalog(this.slistLang);
    }

    getSTitle() {
        this._listService.getSDetails(this.sList).map(x => x).subscribe(x => {
            if (x) {
                let title = x.title;
                if (title && title.length < 30 && x.description) {
                    title += " &ndash; " + x.description;
                }
                if (!title) {
                    this.translate.get('APP.SUBTITLE').subscribe((res: string) => {
                        title = res
                    });
                }
                document.getElementById("sListTitle").innerHTML = title;
                if (x.language) {
                    this.slistLang = x.language;
                    if (!this.slistLang.match(/^(de|en)$/)) {
                        this.slistLang = (x.language.toLowerCase() == 'english') ? 'en' : 'de';
                    }
                    console.log("getSTitle: slist title="+title+", slistLang="+this.slistLang);
                }
            }
        })
    }

    showSideMenu() {
        document.getElementById('edit').style.display = 'block';
        document.getElementById('clear').style.display = 'block';
        document.getElementById('finished').style.display = 'block';
        document.getElementById('delete').style.display = 'block';
    }

    // remove accents so we can search for "apfel" and find "äpfel"
    private unaccentedLC(s: string): string {
        if (s) {
            return s.toLowerCase().replace(/[àáâãäå]/g, "a").replace(/ç/g, "c").replace(/[èéêë]/g, "e")
                .replace(/[ìíîï]/g, "i").replace(/ñ/g, "n").replace(/[òóôõö]/g, "o").replace(/[ùúûü]/g, "u")
                .replace(/ß/g, "ss");
        }
        return s;
    }

    // find article from the list of all articles
    performSearch(inp): Array<any> {
        if (!inp || inp.trim() == '') {
            return [];
        }
        inp = inp.trim();
        if (inp.length == 1) {
            inp = inp.toUpperCase()
        }

        let foundArticles = [];
        let foundNames = new Set();
        // first find articles that start with the search string...
        let startsWith = new RegExp("^" + this.unaccentedLC(inp), "i");
        for (let i = 0; i < this.articles.length && foundArticles.length < MAX_HITS_DISPLAYED; i++) {
            let lcName = this.unaccentedLC(this.articles[i].name);
            if (lcName.match(startsWith) && !foundNames.has(lcName)) {
                foundNames.add(lcName);
                let item = this.articles[i];
                item.backGroundColor = (this.findInListArticles(item.$key)) ? COLOR_INSLIST : COLOR_CATALOGITEM;
                foundArticles.push(this.articles[i]);
            }
        }
        console.log(foundArticles.length + " hits that start with " + inp);
        // if we still don't have enough, also show articles that contain the search string somewhere in the middle
        let contains = new RegExp(this.unaccentedLC(inp), "i"); // \\B is "non-word boundary"
        for (let i = 0; i < this.articles.length && foundArticles.length < MAX_HITS_DISPLAYED; i++) {
            let lcName = this.unaccentedLC(this.articles[i].name);
            if (lcName.match(contains) && !foundNames.has(lcName)) {
                foundNames.add(lcName);
                let item = this.articles[i];
                item.backGroundColor = (this.findInListArticles(item.$key)) ? COLOR_INSLIST : COLOR_CATALOGITEM;
                foundArticles.push(this.articles[i]);
            }
        }
        console.log(foundArticles.length + " hits that start with or contain " + inp);
        if (foundArticles.length == 0) {
            let art = {
                name: inp.charAt(0).toUpperCase() + inp.slice(1),
                isDefault: false,
                img: 'empty.png'
            };
            console.log("zero articles found for search string '" + inp + "', adding new article: " + JSON.stringify(art));
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
        let articles$ = this._listService.getAllArticles(this.slistLang);
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
                    // console.log("SL1: "+JSON.stringify(item));
                    // get name and image from the article catalog
                    let articleDetail = this.af.database.object(`/articlesx/${this.slistLang}/${x[i].id}`);
                    articleDetail.subscribe(p => {
                        if (p) {
                            for (let j = 0; j < this.articlesList.length; j++) {
                                if (this.articlesList[j].id == p.$key) {
                                    this.articlesList[j].name = p.name;
                                    this.articlesList[j].img = (p.img) ? p.img : "empty.png";
                                    // console.log("SL2: l="+this.slistLang+" : "+JSON.stringify(this.articlesList[j]));
                                    // console.log("SL3: name="+this.articlesList[j].name);
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
        // console.log("addToList new article: " + JSON.stringify(item));
        this.recentArticles.push(item);
        this.searchArticles = [];
        this.search = '';
        if (item.$key) {
            console.log("Adding known article: " + item.name + " = " + item.$key);
            this.addArticleToList(item.$key);
        } else {
            // add a new article with the name the user has just given as a search string
            console.log("Adding UNknown article: " + item.name);
            let art = item;
            let article$ = this._listService.getArticleByName(art.name, this.slistLang).map(x => x);
            article$.subscribe(x => {
                if (item) {
                    if (x && x.length > 0) {
                        item.$key = x[0].$key;
                        this.addArticleToList(x[0].$key);
                        article$.unsubscribe();
                    } else {
                        this._listService.addArticleAndAddToList(this.sList, art, this.slistLang);
                    }
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
            //debugger;
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
                console.log("pushToCatalog item.name=" + item.name);
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
                console.log("changeInCatalog item.name=" + item.name);
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
                console.log("pushToUsersCatalog item.name=" + item.name);
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
                console.log("changeInUsersCatalogs item.name=" + item.name);
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
                        console.log("pushToUserArticles item.name=" + item.name);
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
                        console.log("pushToArticles item.name=" + item.name);
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
    selectArticleInList(art) {
        this.selectedArticleElement = document.activeElement;

        let box: any = document.getElementsByClassName('slist-article-details');
        let amount: any = document.getElementById('amount');

        if (this.detailBox.style.display == 'block') {
            if (art == this.selectedArticleList) {
                // user klicked the same product tile again to close the detail box
                this.updateSList(art);
            } else {
                // user clicked on another article;
                // keep detail box open, and save the previously selected article
                this._listService.updateSList(this.selectedArticleList, this.sList);
                this.selectedArticleList = art;
                amount.focus();
            }
        } else {
            // open the detail box and put the focus on the amount text fiels
            this.detailBox.style.display = 'block';
            this.selectedArticleList = art;
            amount.focus();
        }
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

    // add to/remove from basket
    setToBasket(item, isInBasket) {
        this._listService.setIsInBasket(item.id, this.sList, isInBasket);
        this.closeDetailBox();
    }

    // remove article from shopping list
    removeArticleFromSList(item) {
        this._listService.removeArticleFromSList(item.id, this.sList);
        this.closeDetailBox();
    }

    // update shopping list ui
    updateSList(item) {
        this._listService.updateSList(item, this.sList);
        this.closeDetailBox();
    }

    // Close the detail box and unfocus (blur) the active element so the keyboard on smartphones
    // disappears. Scroll so the just edited article comes into view
    closeDetailBox() {
        this.detailBox.style.display = 'none';
        let focused: any = document.activeElement;
        if (focused) {
            focused.blur();
        }
        if (this.selectedArticleElement) {
            this.selectedArticleElement.scrollIntoView();
        }
    }

}