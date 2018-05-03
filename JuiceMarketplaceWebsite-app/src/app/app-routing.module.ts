import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';


const routes: Routes = [
    {path: '', redirectTo: 'landingpage', pathMatch: 'full'},
    {path: 'landingpage', loadChildren: './landingpage/landingpage.module#LandingpageModule'},
    {path: 'console', loadChildren: './console/console.module#ConsoleModule'},
    {path: 'statistics', loadChildren: './statistics/statistics.module#StatisticsModule'},
    {path: 'news', loadChildren: './news/news.module#NewsModule'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
