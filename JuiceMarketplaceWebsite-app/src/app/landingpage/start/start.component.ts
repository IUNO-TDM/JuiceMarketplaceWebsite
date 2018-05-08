import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-start',
    templateUrl: './start.component.html',
    styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

    quote: string;

    constructor() {
    }

    ngOnInit() {
    }

    showQuote(dev: string, anchor: Element) {
        this.quote = this.quote == dev ? undefined : dev;
        anchor.scrollIntoView({block: "start", behavior: "smooth"});
    }
}
