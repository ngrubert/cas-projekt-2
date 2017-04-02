import {Component, OnInit, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {SharedComponent} from './../../shared/shared.component';
import {UsersService} from './../../services/users.service';
import {user} from './../../model/user';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [UsersService]
})

export class HomeComponent implements OnInit,OnDestroy {

    constructor(public _userService: UsersService) {
    }

    ngOnDestroy() {
    }

    ngOnInit() {
    }
}