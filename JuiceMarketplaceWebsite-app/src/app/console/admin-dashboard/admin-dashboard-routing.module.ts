import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminDashboardComponent} from "./admin-dashboard.component";


const routes: Routes = [
    {
        path: '', component: AdminDashboardComponent, children: [
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class AdminDashboardRoutingModule {
}
