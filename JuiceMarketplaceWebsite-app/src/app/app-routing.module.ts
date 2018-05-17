import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
    {path: '', redirectTo: 'website', pathMatch: 'full'},
    {path: 'website', loadChildren: './website/website.module#WebsiteModule'},
    {path: 'visualization', loadChildren: './visualization/visualization.module#VisualizationModule'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes,{ enableTracing: true })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
