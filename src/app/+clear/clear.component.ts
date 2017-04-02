import { Injectable, Inject} from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseRef } from 'angularfire2';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';

import { SharedComponent } from './../shared/shared.component';
import {LocalStateService} from './../services/localstate.service';
import { UsersService } from './../services/users.service';
import { user } from './../model/user';

@Component({
  selector: 'clear',
  templateUrl: './clear.component.html',
  styleUrls: ['./clear.component.scss']
})
export class ClearComponent implements OnInit {
    private abtusers:user[];
    af: AngularFire;
    sList:any;
    url:any;
    constructor(public _userService: UsersService,private route: ActivatedRoute,
        private router: Router,af: AngularFire) {
        this.af = af;
    }

    ngOnInit() {
        this.url = LocalStateService.getUserKey();
        this.sList = LocalStateService.getSListKey();
        this.showSideMenu();
    }

    // show side nav (extras)
    showSideMenu() {
        document.getElementById('edit').style.display='block';
        document.getElementById('clear').style.display='block';
        document.getElementById('finished').style.display='block';
        document.getElementById('delete').style.display='block';
    }

    // remove all articles from shopping list
    clearArticles(evt){
        evt.preventDefault();
        this.af.database.list(`sList/${this.sList}/articles`).remove();
        this.router.navigate([`list/${this.sList}`,{email:this.url}]);
    }

    // cancel button: redirect to the list
    cancel() {
        this.router.navigate([`list/${this.sList}`,{email:this.url}]);
    }

    cancelCookie() {
        LocalStateService.zap();
        this.router.navigate(['home']);
    }
}