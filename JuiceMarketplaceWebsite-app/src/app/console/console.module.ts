// Angular
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http'; // still needed @see https://github.com/angular/angular/issues/19788

// Angular Material
import {
    MatButtonModule, MatCheckboxModule, MatDialogModule, MatSlider, MatSliderModule,
    MatSlideToggleModule
} from '@angular/material';
import {MatToolbarModule} from '@angular/material';
import {MatMenuModule} from '@angular/material';
import {MatSidenavModule} from '@angular/material'
import {MatTabsModule} from '@angular/material';
import {MatIconModule} from '@angular/material';
import {MatTableModule} from '@angular/material';
import {MatGridListModule} from '@angular/material';
import {MatSelectModule} from '@angular/material';
import {MatInputModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material';
import {MatCardModule} from '@angular/material';

// Flex-Layout
import {FlexLayoutModule} from '@angular/flex-layout';

// Routing
import {ConsoleRoutingModule} from './console-routing.module';

// Components
import {ConsoleComponent} from './console.component';
import {CreateRecipeComponent} from './create-recipe/create-recipe.component';
import {RecipesComponent} from './recipes/recipes.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {UtilitiesModule} from '../utilities/utilities.module';
import {AccessGuard} from './services/user.service';
import {Ng2GoogleChartsModule} from "ng2-google-charts";
import { VaultComponent } from './vault/vault.component';
import { VaultPayoutDialogComponent } from './vault-payout-dialog/vault-payout-dialog.component';
import {RecipeImagePickerModule} from "./recipe-image-picker/recipe-image-picker.module";
import {VaultTestnetHelpDialogComponent} from "./vault-testnet-help-dialog/vault-testnet-help-dialog.component";
import { AdminDashboardsComponent } from './admin-dashboards/admin-dashboards.component';

import {CocktailConfiguratorModule, DragAndDropService} from 'cocktail-configurator'
import {ComponentService} from 'tdm-common'

@NgModule({
    imports: [
        CommonModule,
        ConsoleRoutingModule,
        RouterModule,
        HttpClientModule,
        HttpModule,
        FlexLayoutModule,
        FormsModule,
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
        CreateRecipeComponent,
        RecipesComponent,
        DashboardComponent,
        VaultComponent,
        VaultPayoutDialogComponent,
        VaultTestnetHelpDialogComponent,
        AdminDashboardsComponent
    ],
    providers: [
        AccessGuard,
        ComponentService, 
        DragAndDropService,
        {provide: 'componentSourceUrl', useValue: '/api/components'}
    ],
    bootstrap: [ConsoleComponent],
    entryComponents: [VaultPayoutDialogComponent,VaultTestnetHelpDialogComponent]
})
export class ConsoleModule {
}
