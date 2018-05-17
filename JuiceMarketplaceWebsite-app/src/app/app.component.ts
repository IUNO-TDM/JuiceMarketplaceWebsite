import { Component, OnInit, OnDestroy } from '@angular/core';

import { NgcCookieConsentService } from 'ngx-cookieconsent';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: []
})

export class AppComponent implements OnInit, OnDestroy {


    constructor(private ccService: NgcCookieConsentService) {
    }

    ngOnInit() {

    }

    ngOnDestroy() {

    }

}
