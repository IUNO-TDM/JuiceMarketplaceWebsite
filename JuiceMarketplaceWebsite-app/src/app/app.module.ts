// Angular Modules
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule, LOCALE_ID} from '@angular/core';

// Custom imports
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgcCookieConsentConfig, NgcCookieConsentModule} from 'ngx-cookieconsent';

import {registerLocaleData} from "@angular/common";
import localeDe from '@angular/common/locales/de';

import { LayoutService } from './services/layout.service';
import {FlexLayoutModule} from "@angular/flex-layout";

registerLocaleData(localeDe, 'de');

const cookieConfig: NgcCookieConsentConfig = {
    "cookie": {
        "domain": "iuno.axoom.cloud"
    },
    "position": "bottom-right",
    "theme": "classic",
    "palette": {
        "popup": {
            "background": "#434343",
            "text": "#ffffff",
            "link": "#ffffff"
        },
        "button": {
            "background": "#bdcc36",
            "text": "#ffffff",
            "border": "transparent"
        }
    },
    "type": "info",
    "content": {
        "message": "Um unsere Webseite für Sie optimal gestalten zu können, verwenden wir Cookies. Durch die weitere Nutzung der Webseite stimmen Sie der Verwendung von Cookies zu.",
        "dismiss": "Verstanden",
        "deny": "Refuse cookies",
        "link": "Mehr zum Thema Cookies",
        "href": "https://cookiesandyou.com"
    }
};

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        NgcCookieConsentModule.forRoot(cookieConfig),
        CommonModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        FlexLayoutModule
    ],
    providers: [
        LayoutService,
        {
            provide: LOCALE_ID,
            useValue: 'de'
        }
        ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
