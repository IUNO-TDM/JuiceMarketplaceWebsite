import { Component, OnInit, ViewChild, Inject, OnDestroy, LOCALE_ID } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { MatSidenav } from '@angular/material';
import { HostListener } from '@angular/core';
import { UserService } from "./console/services/user.service";
import { NgcCookieConsentService, NgcInitializeEvent } from 'ngx-cookieconsent';
import { IndexComponent } from './sidebar/index/index.component';
import { LayoutService } from './services/layout.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [UserService]
})

export class AppComponent implements OnInit, OnDestroy {
    locale: string = "en"
    watcher: Subscription
    title = 'app'
    routerSubscription: Subscription
    toolbarMenuVisible = false
    hamburgerButtonVisible = false

    tdmLogoVisible = true;
    accountInfoShortened = false;

    @ViewChild(MatSidenav) sidenav: MatSidenav;
    @ViewChild(IndexComponent) index: IndexComponent;

    constructor(
        @Inject(LOCALE_ID) locale: string,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private layoutService: LayoutService,
        private userService: UserService,
        private ccService: NgcCookieConsentService,
        ) {
            this.locale = locale
            layoutService.layoutProperties.subscribe(layoutProperties => {
            this.toolbarMenuVisible = !layoutProperties.isSmallLayout
            setTimeout(() => {
                this.updateMenuState()
            })
        })
    }

    private isMenuButtonVisible() {
        var menuButtonVisible = this.index.isMenuAvailable()
        return menuButtonVisible
    }

    updateMenuState() {
        if (this.sidenav) {
            this.hamburgerButtonVisible = this.index.isMenuAvailable()
            if (this.toolbarMenuVisible) {
                if (this.index.isMenuAvailable()) {
                    this.sidenav.mode = 'side'
                    this.sidenav.open()
                } else {
                    this.sidenav.close()
                }
            } else {
                this.sidenav.mode = 'push'
                this.sidenav.close()
            }
        }
    }

    ngOnInit() {
        
        // Update texts in Cookie-Consent to match language
        switch (this.locale) {
            case 'de':
                this.ccService.getConfig().content.message = "Um unsere Webseite für Sie optimal gestalten zu können, verwenden wir Cookies. Durch die weitere Nutzung der Webseite stimmen Sie der Verwendung von Cookies zu."
                this.ccService.getConfig().content.dismiss = "Verstanden"
                this.ccService.getConfig().content.deny = "Refuse cookies"
                this.ccService.getConfig().content.link = "Mehr zum Thema Cookies"
                this.ccService.getConfig().content.href = "https://cookiesandyou.com"
                break;
            default:
                this.ccService.getConfig().content.message = "In order to be able to design our website optimally for you, we use cookies. By continuing to use the website, you agree to the use of cookies."
                this.ccService.getConfig().content.dismiss = "Accept"
                this.ccService.getConfig().content.deny = "Refuse cookies"
                this.ccService.getConfig().content.link = "More about cookies"
                this.ccService.getConfig().content.href = "https://cookiesandyou.com"
            break;
        }
        this.ccService.destroy(); //remove previous cookie bar (with default messages)
        this.ccService.init(this.ccService.getConfig()); // update config with translated messages


        this.routerSubscription = this.router.events.subscribe(s => {
            if (s instanceof NavigationEnd) {
                this.updateMenuState()
            }
        })
        this.updateMenuState()
    }

    ngOnDestroy() {
        this.watcher.unsubscribe();
    }

    startClicked() {
        this.router.navigateByUrl('/landingpage');
    }

    tdmClicked() {
        this.userService.isLoggedIn().subscribe(loggedin => {
            if (loggedin) {
                this.router.navigateByUrl('/console');
            } else {
                document.cookie = "redirectTo=/console";
                window.location.href = "/auth/iuno";
            }
        })
    }

    statisticsClicked() {
        this.router.navigateByUrl('/statistics');
    }

    newsClicked() {
        this.router.navigateByUrl('/news');
    }
}
