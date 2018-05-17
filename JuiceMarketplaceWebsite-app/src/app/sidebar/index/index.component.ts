import {Component, OnInit, Input} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {UserService, User} from '../../console/services/user.service';

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
    @Input() showTopItems: boolean = false
    loggedIn: boolean = false

    constructor(private userService: UserService, private router: Router) {
        this.userService.isLoggedIn().subscribe(loggedIn => {
            this.loggedIn = loggedIn
        })
    }

    isMenuAvailable(): boolean {
        var menuAvailable = this.showTopItems
        menuAvailable = menuAvailable || this.showConsoleItems()
        return menuAvailable
    }

    showConsoleItems() {
        var showItems = false
        if (this.showTopItems) {
            if (this.loggedIn) {
                showItems = true
            }
        } else {
            if (this.router.url.startsWith('/website/console')) {
                showItems = true
            }
        }
        return showItems
    }

    ngOnInit() {
    }

    // ------------------------
    //  Main Index
    // ------------------------
    openLandingPage() {
        this.router.navigateByUrl('')
    }

    openConsole() {
        this.userService.isLoggedIn().subscribe(loggedin => {
            if (loggedin) {
                this.router.navigateByUrl('/website/console');
            } else {
                document.cookie = "redirectTo=/website/console";
                window.location.href = "/auth/iuno";
            }
        })
    }

    openStatistics() {
        this.router.navigateByUrl('/website/statistics')
    }

    openNews() {
        this.router.navigateByUrl('/website/news')
    }

    // ------------------------
    //  Console
    // ------------------------
    openDashboard() {
        this.router.navigateByUrl('/website/console/dashboard')
    }

    openCreateRecipe() {
        this.router.navigateByUrl('/website/console/create-recipe')
    }

    openRecipes() {
        this.router.navigateByUrl('/website/console/recipes')
    }

    openVault() {
        this.router.navigateByUrl('/website/console/vault')
    }
}
