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
    ULTIMAKER_TECHNOLOGY_UUID = "adb4c297-45bd-437e-ac90-2aed14f6b882";
    COCKTAIL_TECHNOLOGY_UUID = "da17a8fc-a5b3-40a4-b6a5-276667db027a";

    constructor(private technologDataService: TechnologydataService) {
    }

    ngOnInit() {
        this.technologDataService.updateTechnologyData();
        this.technologDataService.technologyData.subscribe(td => this.technologyData = td);
    }

}
