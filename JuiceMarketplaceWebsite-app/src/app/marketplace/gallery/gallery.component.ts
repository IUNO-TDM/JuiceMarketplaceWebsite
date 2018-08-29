import {Component, OnInit} from '@angular/core';
import {TechnologydataService} from "../services/technologydata.service";
import {TdmTechnologyData} from "tdm-common";

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.css'],
    providers: [TechnologydataService]
})
export class GalleryComponent implements OnInit {

    technologyData: TdmTechnologyData[];

    constructor(private technologDataService: TechnologydataService) {
    }

    ngOnInit() {
        this.technologDataService.updateTechnologyData();
        this.technologDataService.technologyData.subscribe(td => this.technologyData = td);
    }

}
