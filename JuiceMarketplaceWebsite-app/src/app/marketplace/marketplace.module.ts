import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GalleryComponent} from './gallery/gallery.component';
import {MarketplaceRoutingModule} from "./marketplace-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {MatCardModule, MatDialogModule, MatListModule} from "@angular/material";
import {FlexLayoutModule} from "@angular/flex-layout";
import {DetailDialogComponent} from './detail-dialog/detail-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        MarketplaceRoutingModule,
        MatCardModule,
        FlexLayoutModule,
        MatDialogModule,
        MatListModule
    ],
    entryComponents: [
        DetailDialogComponent
    ],
    declarations: [GalleryComponent, DetailDialogComponent]
})
export class MarketplaceModule {
}
