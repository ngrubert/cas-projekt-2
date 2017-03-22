import {Component, OnInit, ViewChild, OnDestroy, HostListener} from '@angular/core';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Observable} from 'rxjs/Observable';

declare var PouchDB: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

// App component initilization with OnInit and OnDestroy life cycle callbacks
export class AppComponent implements OnInit,OnDestroy {
    localUser: any;
    isMobile: boolean;
    db: any;
    private url;
    private user;
    private sList;
    @ViewChild('start') start;

    // window resize check for the device dimenions
    @HostListener('window:resize', ['$event'])  onResize(event) {
        this.detectDevice();
    }

    constructor(private route: ActivatedRoute,
                private router: Router,
                private translate: TranslateService) {
        this.db = new PouchDB("sList");

        // this language will be used as a fallback when a translation isn't found in the current language
        translate.addLangs(["en", "de"]);
        translate.setDefaultLang('en');

        let browserLang = translate.getBrowserLang();
        //translate.use(browserLang.match(/en|de/) ? browserLang : 'en');
        console.log("Browser language: " + browserLang.toString());
        translate.use("de");
    }

    // called on component creation
    ngOnInit() {
        let self = this;

        // get email or slistid on page route if exists
        this.user = this.route.params
            .switchMap((params: Params) => {
                this.url = params['email'];
                this.sList = params['id'];
                return Observable.from([1, 2, 3]).map(x => x);
            });
        this.user.subscribe(c => console.log(c));

        this.detectDevice();
        // get user email id from local database(pouch db)
        this.syncChanges();
    }

    syncChanges() {
        let self = this;
        this.db.allDocs({include_docs: true, descending: true}, function (err, docs) {
            if (err) {
                console.log(err);
                return err;
            }
            if (docs && docs.rows.length > 0) {
                self.sList = docs.rows[0].doc.sList;
                self.setLocalUser(docs.rows[0].doc);
            }
        });
    }

    goToShoppingList() {
        if (this.sList && this.localUser) {
            this.router.navigate(['list', this.sList, {email: this.localUser}]);
        } else {
            this.router.navigate(['home']);
        }
    }

    ngOnDestroy() {
    }

    // hide/show side nav
    toggleNav() {
        this.start.toggle();
    }

    setLocalUser(obj) {
        if (obj) {
            this.localUser = obj.user;
        }
    }

    // device specifications for mobile
    detectDevice() {
        this.isMobile = (window.innerWidth <= 800);
    }
}






