// Angular
import {NgModule, LOCALE_ID} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http'; // still needed @see https://github.com/angular/angular/issues/19788

// Angular Material
import {
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule
} from '@angular/material';
// Flex-Layout
import {FlexLayoutModule} from '@angular/flex-layout';
// Routing
import {ConsoleRoutingModule} from './console-routing.module';
// Components
import {ConsoleComponent} from './console.component';
import {ComponentListDialogComponent} from './component-list-dialog/component-list-dialog.component'
import {CreateRecipeComponent} from './create-recipe/create-recipe.component';
import {RecipesComponent} from './recipes/recipes.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {UtilitiesModule} from '../utilities/utilities.module';
import {AccessGuard} from './services/user.service';
import {Ng2GoogleChartsModule} from "ng2-google-charts";
import {RecipeImagePickerModule} from "./recipe-image-picker/recipe-image-picker.module";

import {CocktailConfiguratorModule, DragAndDropService} from 'cocktail-configurator'
import {TdmCocktailComponentService} from 'tdm-common'

@NgModule({
    imports: [
        CommonModule,
        ConsoleRoutingModule,
        RouterModule,
        HttpClientModule,
        HttpModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatToolbarModule,
        MatMenuModule,
        MatSidenavModule,
        MatTabsModule,
        MatIconModule,
        MatTableModule,
        MatCardModule,
        MatGridListModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        RecipeImagePickerModule,
        UtilitiesModule,
        Ng2GoogleChartsModule,
        MatDialogModule,
        MatSliderModule,
        MatSlideToggleModule,
        CocktailConfiguratorModule
    ],
    declarations: [
        ConsoleComponent,
        ComponentListDialogComponent,
        CreateRecipeComponent,
        RecipesComponent,
        DashboardComponent
    ],
    providers: [
        AccessGuard,
        TdmCocktailComponentService,
        DragAndDropService,
        {provide: 'componentSourceUrl', useValue: '/api/components'}
    ],
    bootstrap: [ConsoleComponent],
    entryComponents: [
        ComponentListDialogComponent,
    ]
})
export class ConsoleModule {
}
