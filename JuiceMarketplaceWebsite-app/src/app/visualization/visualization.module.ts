import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from "@angular/flex-layout";
import {VisualizationSocket} from "./services/visualization-socket.service";
import {VisualizationRoutingModule} from "./visualization-routing.module";
import {VisualizationComponent} from "./visualization/visualization.component";
import {BlockexplorerComponent} from "./visualization/blockexplorer/blockexplorer.component";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        VisualizationRoutingModule,
        HttpClientModule,
        FormsModule
    ],
    declarations: [VisualizationComponent, BlockexplorerComponent],
    providers: [VisualizationSocket]
})
export class VisualizationModule {
}
