import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConnectedClientsComponent} from './connected-clients/connected-clients.component';
import {AdminDashboardComponent} from './admin-dashboard.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatCardModule, MatSelectModule} from "@angular/material";
import {Ng2GoogleChartsModule} from "ng2-google-charts";

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        MatCardModule,
        MatSelectModule,
        Ng2GoogleChartsModule
    ],
    declarations: [
        ConnectedClientsComponent,
        AdminDashboardComponent
    ],
    bootstrap: [
        AdminDashboardComponent
    ]
})
export class AdminDashboardModule {
}
