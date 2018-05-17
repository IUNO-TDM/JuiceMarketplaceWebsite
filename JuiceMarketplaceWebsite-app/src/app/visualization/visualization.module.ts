import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from "@angular/flex-layout";
import {VisualizationSocket} from "./services/visualization-socket.service";
import {VisualizationRoutingModule} from "./visualization-routing.module";
import {VisualizationComponent} from "./visualization/visualization.component";

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        VisualizationRoutingModule
    ],
    declarations: [VisualizationComponent],
    providers: [VisualizationSocket]
})
export class VisualizationModule {
}
