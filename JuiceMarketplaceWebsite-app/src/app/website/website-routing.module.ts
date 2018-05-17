import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {WebsiteComponent} from "./website.component";

const routes: Routes = [{
    path: '', component: WebsiteComponent, children: [
        {path: '', redirectTo: 'landingpage', pathMatch: 'full'},
        {path: 'landingpage', loadChildren: '../landingpage/landingpage.module#LandingpageModule'},
        {path: 'console', loadChildren: '../console/console.module#ConsoleModule'},
        {path: 'statistics', loadChildren: '../statistics/statistics.module#StatisticsModule'},
        {path: 'news', loadChildren: '../news/news.module#NewsModule'}
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class WebsiteRoutingModule {
}
