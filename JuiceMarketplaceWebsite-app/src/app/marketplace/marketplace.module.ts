import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryComponent } from './gallery/gallery.component';
import { MarketplaceRoutingModule } from './marketplace-routing.module';
import { HttpClientModule } from '@angular/common/http';
import {
  MatCardModule,
  MatDialogModule,
  MatListModule,
  MatButtonModule,
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GalleryDetailComponent } from './gallery-detail/gallery-detail.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MarketplaceRoutingModule,
    MatCardModule,
    FlexLayoutModule,
    MatDialogModule,
    MatListModule,
    MatButtonModule
  ],
  entryComponents: [],
  declarations: [GalleryComponent, GalleryDetailComponent],
})
export class MarketplaceModule {}
