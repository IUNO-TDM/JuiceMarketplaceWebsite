import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from "../../console/services/user.service";

@Component({
    selector: 'app-console-menu',
    templateUrl: './console-menu.component.html',
    styleUrls: ['./console-menu.component.css']
})
export class ConsoleMenuComponent implements OnInit {

    public isAdmin: boolean = false;

    constructor(private router: Router, private userService: UserService) {
    }

    ngOnInit() {
        this.userService.isAdmin().subscribe(isAdmin => {
            this.isAdmin = isAdmin;
        });
    }

    openDashboard() {
        this.router.navigateByUrl('/console/dashboard');
    }

    openCreateRecipe() {
        this.router.navigateByUrl('/console/create-recipe');
    }

    openRecipes() {
        this.router.navigateByUrl('/console/recipes');
    }

    openVault() {
        this.router.navigateByUrl('/console/vault');
    }

    openAdminDashboard() {
        this.router.navigateByUrl('/console/admin-dashboard');
    }
}
