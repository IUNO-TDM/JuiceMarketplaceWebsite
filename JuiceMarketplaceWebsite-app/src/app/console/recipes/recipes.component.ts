import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/observable/of';

import {RecipeService} from '../services/recipe.service';
import {TdmCocktailRecipe} from 'tdm-common';
import {ActivatedRoute} from '@angular/router';
import {AccessGuard} from '../services/user.service';

@Component({
    selector: 'app-recipes',
    templateUrl: './recipes.component.html',
    styleUrls: ['./recipes.component.css'],
    providers: [RecipeService]
})

export class RecipesComponent implements OnInit {
    displayedColumns = ["position", "name", "description", "licensefee", "action"];
    dataSource = new MatTableDataSource<TdmCocktailRecipe>();
    errorMaxRecipes = false;

    constructor(private recipeService: RecipeService,
                private route: ActivatedRoute,
                private accessGuard: AccessGuard) {
        this.route.params.subscribe(params => {
            this.errorMaxRecipes = params['errorMaxRecipes'] ? true : false;
        });
        this.recipeService.recipes.subscribe(recipes => {
            this.dataSource.data = recipes;
        });
    }

    ngOnInit() {
    }

    deleteRecipe(recipe: TdmCocktailRecipe) {
        this.accessGuard.guardLoggedIn().subscribe(loggedIn => {
            if (loggedIn) {
                this.errorMaxRecipes = false;
                this.recipeService.deleteRecipe(recipe);
            }
        });
    }

}
