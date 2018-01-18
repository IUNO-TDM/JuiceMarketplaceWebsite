import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { ViewEncapsulation } from '@angular/core/src/metadata/view';
import { UserService, User } from './services/user.service';

@Component({
  selector: 'console-root',
  templateUrl: './console.component.html',
  styleUrls: [
    './console.component.css'
  ],
  providers: [UserService]  
})

export class ConsoleComponent implements OnInit {
  title = 'console';
  user: User = null;
  spinnerCounter = 0;

  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(
    private router: Router,
    private userService: UserService
  ) {
    if (userService.isLoggedIn()) {
      console.log("LoggedIn!");
    } else {
      console.log("Not LoggedIn!");
    }
  }

  ngOnInit() {
    this.spinnerCounter += 1;
    // this.userService.user.subscribe(user => {
    //   if (user != null) {
    //     this.user = user;
    //     this.spinnerCounter -= 1;
    //   }
    // });
  }

  openDashboard() {
    this.router.navigate(['dashboard']);
  }

  openCreateRecipe() {
    this.router.navigate(['create-recipe']);
  }

  openRecipes() {
    this.router.navigate(['recipes']);
  }
}
