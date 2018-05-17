import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WebsiteComponent} from './website.component';
import {WebsiteRoutingModule} from "./website-routing.module";
import {MatButtonModule, MatIconModule, MatMenuModule, MatSidenavModule, MatToolbarModule} from "@angular/material";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FooterComponent} from "../footer/footer.component";
import {AccountComponent} from "../account/account.component";
import {IndexComponent} from "../sidebar/index/index.component";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
    declarations: [WebsiteComponent,
        FooterComponent,
        AccountComponent,
        IndexComponent],
    imports: [
        CommonModule,
        WebsiteRoutingModule,
        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        FlexLayoutModule,
        HttpClientModule
    ]
})
export class WebsiteModule {
}
