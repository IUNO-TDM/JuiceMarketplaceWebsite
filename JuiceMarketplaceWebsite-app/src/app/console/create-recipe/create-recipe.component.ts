import {Injectable, ViewChild, ElementRef, HostListener} from '@angular/core';
import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router, ActivatedRoute} from '@angular/router';
import { MatDialog } from '@angular/material';
import * as $ from 'jquery';

import {MarketplaceService} from '../services/marketplace.service';
import {RecipeService} from '../services/recipe.service';
import {AccessGuard} from '../services/user.service';
import "rxjs/add/operator/combineLatest"
import {RecipeImagePickerComponent} from "../recipe-image-picker/recipe-image-picker/recipe-image-picker.component";

import {Recipe} from 'tdm-common'
import {Cocktail} from 'tdm-common'
import {CocktailComponent} from 'tdm-common'
import {CocktailLayer} from 'tdm-common'
import {ComponentService} from 'tdm-common'
import {ComponentListComponent, DragAndDropService, BeakerComponent, ComponentListDialogComponent} from 'cocktail-configurator'

@Component({
    selector: 'app-create-recipe',
    templateUrl: './create-recipe.component.html',
    styleUrls: ['./create-recipe.component.css'],
    providers: [MarketplaceService, RecipeService],
})

@Injectable()
export class CreateRecipeComponent implements OnInit {
    @ViewChild(RecipeImagePickerComponent) recipeImagePicker: RecipeImagePickerComponent;
    @ViewChild(BeakerComponent) beaker: BeakerComponent;

    recipe = new Recipe()
    cocktail: Cocktail;
    components: CocktailComponent[] = [];

    showRecommendedComponents = false
    showInstalledComponents = false
    showAvailableComponents = true

    // components: TdmComponent[];
    licenseFees: number[] = [0.25, 0.5, 0.75, 1.00];
    spinnerCounter = 0;
    recipeName: string = "";
    recipeDescription: string = "";
    recipeLicenseFee: number = -1;
    recipesLeft = 0;
    recipeLimit = 0;
    recipeCount = 0;

    constructor(private marketplaceService: MarketplaceService,
                private dialog: MatDialog,
                private recipeService: RecipeService,
                private http: HttpClient,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private accessGuard: AccessGuard,
                private componentService: ComponentService) {

        this.cocktail = new Cocktail();
        this.cocktail.amount = 100;
        componentService.availableComponents.subscribe(components => {
            this.components = components;
        })
    }

    getBeakerEditMode() {
        var editMode = false;
        var ua = window.navigator.userAgent;
        // https://stackoverflow.com/a/25394023/1771537
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) {
            editMode = true
        } else {
            let windowWidth = window.innerWidth;
            if (windowWidth < 960) {
                editMode = true
            }
        }
        return editMode
    }

    ngOnInit() {
        this.spinnerCounter += 1;

        var rc = this.recipeService.getRecipeCount();
        var rl = this.recipeService.getRecipeLimit();
        rl.subscribe(limit => this.recipeLimit = limit);
        rc.subscribe(count => this.recipeCount = count);
        rc.combineLatest(rl, (count, limit) => limit - count).subscribe(result => {
            this.recipesLeft = result;
            this.spinnerCounter -= 1;
            if (this.recipesLeft <= 0) {
                this.router.navigate(['../recipes', {errorMaxRecipes: true}], {relativeTo: this.activatedRoute});
            }
        });
    }

    actionSaveRecipe() {
        this.accessGuard.guardLoggedIn().subscribe(loggedIn => {
            if (loggedIn) {
                let valid = true;
                const recipe = new Recipe();

                recipe.title = this.recipeName;
                recipe.licenseFee = this.recipeLicenseFee * 100000;
                recipe.description = this.recipeDescription.trim();
                recipe.imageRef = this.recipeImagePicker.getSelectedImage();
                recipe.backgroundColor = this.recipeImagePicker.backgroundColor;

                if (valid && recipe.title.trim().length < 1) {
                    alert("Bitte geben Sie einen Titel mit mindestens einem Zeichen ein.");
                    valid = false;
                }
                if (valid && recipe.description.length < 1) {
                    alert("Bitte geben Sie eine Beschreibung mit mindestens einem Zeichen ein.");
                    valid = false;
                }
                if (valid && recipe.licenseFee == -1) {
                    alert("Bitte wählen Sie eine Lizenzgebühr aus.");
                    valid = false;
                }
                if (valid && (this.cocktail.layers.length == 0 || this.cocktail.layers[0].components.length == 0)) {
                    alert("Bitte fügen Sie mindestens eine Zutat hinzu.");
                    valid = false;
                }
                if (valid) {
                    this.spinnerCounter += 1;
                    // create json
                    let machineProgram = this.cocktail.getMachineProgram();

                    recipe.program = machineProgram;
                    console.log("Recipe:");
                    console.log(recipe);

                    this.http.post('/api/users/me/recipes', recipe).subscribe(
                        data => {
                            this.spinnerCounter -= 1;
                        },
                        error => {
                            this.spinnerCounter -= 1;
                            if (error.status == 201) { // this isn't an error. @see https://github.com/angular/angular/issues/18396
                                this.router.navigateByUrl('/console/recipes');
                            }
                            else if (error.status == 409) {
                                alert("Ein Rezept mit diesem Namen existiert bereits");
                                this.spinnerCounter -= 1;
                            }
                            else {
                                alert("Es ist ein Fehler aufgetreten.\nDas Rezept konnte nicht gespeichert werden. Fehler: " + error.message);
                                this.spinnerCounter -= 1;
                            }
                        }
                    );
                }
            }
        });
    }

    selectComponent(callback: (component: CocktailComponent) => any) {
        let dialogRef = this.dialog.open(ComponentListDialogComponent, {
            width: '300px',
            data: {
                showRecommended: this.showRecommendedComponents,
                showInstalled: this.showInstalledComponents,
                showAvailable: this.showAvailableComponents,
            },
            autoFocus: false
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                callback(result)
            }
        });
    }

}
