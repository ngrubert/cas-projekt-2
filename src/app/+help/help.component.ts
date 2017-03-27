import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {TranslateService} from '@ngx-translate/core';

// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';

import {SharedComponent} from './../shared/shared.component';
import {LocalStateService} from './../services/localstate.service';
import {UsersService} from './../services/users.service';
import {user} from './../model/user';

@Component({
    selector: 'help',
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.scss']
})

export class HelpComponent implements OnInit {
    private abtusers: user[];
    public currentLang: string;

    constructor(public _userService: UsersService,
                private translate: TranslateService) {
        this.currentLang = translate.currentLang;
    }

    ngOnInit() {
    }
}