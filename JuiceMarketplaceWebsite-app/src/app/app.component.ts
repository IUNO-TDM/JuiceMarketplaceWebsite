import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
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
    watcher: Subscription
    title = 'app'
    routerSubscription: Subscription
    toolbarMenuVisible = false
    hamburgerButtonVisible = false

    tdmLogoVisible = true;
    accountInfoShortened = false;

    @ViewChild(MatSidenav) sidenav: MatSidenav;
    @ViewChild(IndexComponent) index: IndexComponent;

    constructor(private router: Router,
        private activatedRoute: ActivatedRoute,
        private layoutService: LayoutService,
        private userService: UserService,
        private ccService: NgcCookieConsentService) {
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
