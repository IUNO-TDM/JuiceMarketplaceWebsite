import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../console/services/user.service';

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
    @Input() showTopItems: boolean = false;
    loggedIn: boolean = false;
    public isAdmin: boolean = false;

    constructor(private userService: UserService, private router: Router) {
        this.userService.isLoggedIn().subscribe(loggedIn => {
            this.loggedIn = loggedIn
        })
    }

    isMenuAvailable(): boolean {
        let menuAvailable = this.showTopItems;
        menuAvailable = menuAvailable || this.showConsoleItems();
        return menuAvailable
    }

    showConsoleItems() {
        let showItems = false;
        if (this.showTopItems) {
            if (this.loggedIn) {
                showItems = true
            }
        } else {
            if (this.router.url.startsWith('/console')) {
                showItems = true
            }
        }
        return showItems
    }

    ngOnInit() {
        this.userService.isAdmin().subscribe(isAdmin => {
            this.isAdmin = isAdmin;
        });
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
                this.router.navigateByUrl('/console');
            } else {
                document.cookie = "redirectTo=/console";
                window.location.href = "/auth/iuno";
            }
        })
    }

    openStatistics() {
        this.router.navigateByUrl('/statistics')
    }

    openNews() {
        this.router.navigateByUrl('/news')
    }

    // ------------------------
    //  Console
    // ------------------------
    openDashboard() {
        this.router.navigateByUrl('/console/dashboard')
    }

    openCreateRecipe() {
        this.router.navigateByUrl('/console/create-recipe')
    }

    openRecipes() {
        this.router.navigateByUrl('/console/recipes')
    }

    openVault() {
        this.router.navigateByUrl('/console/vault')
    }

    openAdminDashboard() {
        this.router.navigateByUrl('/console/admin-dashboard');
    }
}
