import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ConsoleComponent} from './console.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {CreateRecipeComponent} from './create-recipe/create-recipe.component';
import {RecipesComponent} from './recipes/recipes.component';
import {AccessGuard} from './services/user.service';
import {VaultComponent} from "./vault/vault.component";
import {AdminDashboardsComponent} from "./admin-dashboards/admin-dashboards.component";

const routes: Routes = [
    {
        path: '', component: ConsoleComponent, children: [
            {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
            {path: 'dashboard', component: DashboardComponent, canActivate: [AccessGuard]},
            {path: 'create-recipe', component: CreateRecipeComponent, canActivate: [AccessGuard]},
            {path: 'recipes', component: RecipesComponent, canActivate: [AccessGuard]},
            {path: 'vault', component: VaultComponent, canActivate: [AccessGuard]},
            {path: 'admin-dashboard', component: AdminDashboardsComponent}
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [
        AccessGuard,
    ]
})
export class ConsoleRoutingModule {
}
