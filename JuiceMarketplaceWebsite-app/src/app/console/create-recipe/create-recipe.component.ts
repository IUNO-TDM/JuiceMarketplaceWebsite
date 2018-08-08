import { Injectable, ViewChild, ElementRef, HostListener, OnDestroy, Inject, LOCALE_ID } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, ErrorStateMatcher } from '@angular/material';
// import * as $ from 'jquery';

import { RecipeService } from '../services/recipe.service';
import { AccessGuard } from '../services/user.service';
import "rxjs/add/operator/combineLatest"
import { RecipeImagePickerComponent } from "../recipe-image-picker/recipe-image-picker/recipe-image-picker.component";

import { TdmCocktailRecipe } from 'tdm-common'
import { TdmCocktailProgram } from 'tdm-common'
import { TdmCocktailComponent } from 'tdm-common'
import { TdmCocktailComponentService } from 'tdm-common'
import { ComponentListComponent, DragAndDropService, BeakerComponent } from 'cocktail-configurator'
import { Subscription } from 'rxjs';
import { LayoutService } from '../../services/layout.service';
import { ComponentListDialogComponent } from '../component-list-dialog/component-list-dialog.component';
import { FormGroup, Validators, FormControl } from '@angular/forms';
// import { FormControl, FormGroupDirective, NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';

/** Error when invalid control is dirty, touched, or submitted. */
// export class RecipeErrorStateMatcher implements ErrorStateMatcher {
//     isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
//         console.log(control)
//         return true
//         //   const isSubmitted = form && form.submitted;
//         //   return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
//     }
// }

@Component({
    selector: 'app-create-recipe',
    templateUrl: './create-recipe.component.html',
    styleUrls: ['./create-recipe.component.css'],
    providers: [RecipeService],
})

@Injectable()
export class CreateRecipeComponent implements OnInit {
    @ViewChild(RecipeImagePickerComponent) recipeImagePicker: RecipeImagePickerComponent;

    @ViewChild(BeakerComponent)
    set beakerComponent(component: BeakerComponent) {
        this.beaker = component
        setTimeout(() => {
            if (this.beaker) {
                this.beaker.setEditMode(this.isBeakerEditModeEnabled)
            }
        })
    }

    recipeForm = new FormGroup({
        name: new FormControl('', [ Validators.required, Validators.minLength(1), Validators.maxLength(250)]),
        description: new FormControl('', [ Validators.required, Validators.minLength(1), Validators.maxLength(30000)]),
        licenseFee: new FormControl('', [ Validators.required]),
    })

    // recipeForm: FormGroup
    // errorStateMatcher = new RecipeErrorStateMatcher();
    errorFields: any;

    beaker: BeakerComponent = null;
    cocktail: TdmCocktailProgram;
    components: TdmCocktailComponent[] = [];
    isBeakerEditModeEnabled = false

    showRecommendedComponents = true;
    showInstalledComponents = false;
    showAvailableComponents = true;

    licenseFees: number[] = [0.25, 0.5, 0.75, 1.00];
    spinnerCounter = 0;
    // recipeName: string = "";
    // recipeDescription: string = "";
    // recipeLicenseFee: number = -1;
    recipesLeft = 0;
    recipeLimit = 0;
    recipeCount = 0;

    constructor(
        private dialog: MatDialog,
        private recipeService: RecipeService,
        private http: HttpClient,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private accessGuard: AccessGuard,
        private layoutService: LayoutService,
        private componentService: TdmCocktailComponentService,
        // private builder: FormBuilder
    ) {
        // this.recipeForm = this.builder.group({
        //     title: ['', Validators.required],
        //     description: ['', Validators.required],
        //     licenseFee: [-1, Validators.required]
        // })
        this.errorFields = {
            program: false,
            title: false,
            description: false,
            licenseFee: false
        }

        this.cocktail = new TdmCocktailProgram();
        this.cocktail.amount = 100;
        componentService.availableComponents.subscribe(components => {
            this.components = components;
        })
        layoutService.layoutProperties.subscribe(layoutProperties => {
            // console.log("layoutProperties.mqAlias = " + layoutProperties.mqAlias + ", touchDevice = " + layoutProperties.isTouchDevice)
            var editMode = false
            if (layoutProperties.isTouchDevice ||
                layoutProperties.mqAlias == 'xs' ||
                layoutProperties.mqAlias == 'sm' ||
                layoutProperties.mqAlias == 'md') {
                editMode = true
            }
            // console.log("editMode = " + editMode + ", beaker = " + this.beaker)
            this.isBeakerEditModeEnabled = editMode
            if (this.beaker) {
                setTimeout(() => {
                    this.beaker.setEditMode(this.isBeakerEditModeEnabled)
                })
            }

        })
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
                this.router.navigate(['../recipes', { errorMaxRecipes: true }], { relativeTo: this.activatedRoute });
            }
        });
    }

    onSubmit() {
        this.accessGuard.guardLoggedIn().subscribe(loggedIn => {
            if (loggedIn) {
                let valid = true;
                const recipe = new TdmCocktailRecipe();

                recipe.name = this.recipeForm.get('name').value;
                recipe.description = this.recipeForm.get('description').value.trim();
                recipe.licenseFee = this.recipeForm.get('licenseFee').value * 100000;
                recipe.imageRef = this.recipeImagePicker.getSelectedImage();
                recipe.backgroundColor = this.recipeImagePicker.backgroundColor;

                var anchorName = null

                if (recipe.name.trim().length < 1) {
                    anchorName = "#detailsCard"
                    // this.recipeForm.controls['title'].setErrors({error: true})
                    this.errorFields.title = true
                    valid = false;
                    // this.router.navigateByUrl("#recipeName")
                } else {
                    this.errorFields.title = false
                }
                if (recipe.description.length < 1) {
                    anchorName = "#detailsCard"
                    this.errorFields.description = true
                    // alert("Bitte geben Sie eine Beschreibung mit mindestens einem Zeichen ein.");
                    valid = false;
                } else {
                    this.errorFields.description = false
                }
                if (this.licenseFees.indexOf(this.recipeForm.get('licenseFee').value) < 0) {
                    anchorName = "#detailsCard"
                    this.errorFields.licenseFee = true
                    // alert("Bitte wählen Sie eine Lizenzgebühr aus.");
                    valid = false;
                } else {
                    this.errorFields.licenseFee = false
                }
                if ((this.cocktail.layers.length == 0 || this.cocktail.layers[0].components.length == 0)) {
                    anchorName = "#programCard"
                    this.errorFields.program = true
                    // alert("Bitte fügen Sie mindestens eine Zutat hinzu.");
                    valid = false;
                } else {
                    this.errorFields.program = false
                }
                if (valid) {
                    this.spinnerCounter += 1;
                    // create json
                    let machineProgram = this.cocktail.getMachineProgram();

                    recipe.program = machineProgram;

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
                } else {
                    if (anchorName) {
                        let target = document.querySelector(anchorName)
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        })
                        // remove anchor jump from backstack
                        // history.pushState(null, null, anchorName)
                    }
                }
            }
        });
    }

    selectComponent(callback: (component: TdmCocktailComponent) => any) {
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
