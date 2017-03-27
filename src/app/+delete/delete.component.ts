import {Injectable, Inject}     from '@angular/core';
import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseRef} from 'angularfire2';

import {SharedComponent} from './../shared/shared.component';
import {LocalStateService} from './../services/localstate.service';
import {UsersService} from './../services/users.service';
import {user} from './../model/user';

@Component({
    selector: 'delete',
    templateUrl: './delete.component.html',
    styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {
    private abtusers: user[];
    af: AngularFire;
    sList: any;
    url: any;
    modelValue: any;
    localDBID;

    constructor(public _userService: UsersService, private route: ActivatedRoute,
                private router: Router, af: AngularFire) {
        this.af = af;
    }

    ngOnInit() {
        this.url = LocalStateService.getUserKey();
        this.sList = LocalStateService.getSListKey();
        this.getSListDetail();
        this.showSideMenu();
    }


    // show side nav extras
    showSideMenu() {
        document.getElementById('edit').style.display = 'block';
        document.getElementById('clear').style.display = 'block';
        document.getElementById('finished').style.display = 'block';
        document.getElementById('delete').style.display = 'block';
    }

    // get shopping list details by id
    getSListDetail() {
        this.af.database.object(`sList/${this.sList}`).map(x => x).subscribe(x => {
            this.modelValue = x.title;
        })
    }

    // delete shopping list and also the sListUsers by id
    deleteSList() {
        let self = this;
        this.af.database.list(`sList/${this.sList}`).remove();
        this.af.database.list(`sListUsers/${this.sList}`).remove();
        LocalStateService.deleteSListKey();
        this.router.navigate([`lists`, {email: this.url}]);
    }

    // cancel button: redirect to the list
    cancel() {
        this.router.navigate([`list/${this.sList}`, {email: this.url}]);
    }

}