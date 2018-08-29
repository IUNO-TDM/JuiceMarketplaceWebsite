import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { GalleryComponent } from './gallery/gallery.component';
import {MarketplaceRoutingModule} from "./marketplace-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {MatCardModule} from "@angular/material";
import {FlexLayoutModule} from "@angular/flex-layout";

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        MarketplaceRoutingModule,
        MatCardModule,
        FlexLayoutModule
    ],
    declarations: [GalleryComponent]
})
export class MarketplaceModule {
}
