import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConnectedClientsComponent} from './connected-clients/connected-clients.component';
import {AdminDashboardComponent} from './admin-dashboard.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatCardModule, MatSelectModule} from "@angular/material";
import {Ng2GoogleChartsModule} from "ng2-google-charts";
import {AdminDashboardRoutingModule} from "./admin-dashboard-routing.module";

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        MatCardModule,
        MatSelectModule,
        Ng2GoogleChartsModule,
        AdminDashboardRoutingModule
    ],
    declarations: [
        ConnectedClientsComponent,
        AdminDashboardComponent
    ],
    bootstrap: [
        AdminDashboardComponent
    ],
    providers:[

    ]
})
export class AdminDashboardModule {
}
