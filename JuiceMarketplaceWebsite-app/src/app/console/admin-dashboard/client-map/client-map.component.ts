import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-client-map',
    templateUrl: './client-map.component.html',
    styleUrls: ['./client-map.component.css']
})
export class ClientMapComponent implements OnInit {

    public geoDataReady: boolean = false;
    public geoData: any;

    constructor() {
    }

    ngOnInit() {
        this.loadGeoData();
    }


    loadGeoData() {
        this.geoData = {
            chartType: 'GeoChart',
            apiKey: 'AIzaSyDlZ5Yh79toiIzEV_NIQGX8F42663WGTxg',
            dataTable: [
                ['Lat', 'Long', 'Value'],
                [49.431411, 7.751871, 2],
                [48.251981, 11.634248, 2],
                [49.798497, 8.823595, 3],
                [49.000273, 8.409850, 4],
                [48.817400, 9.065440, 5],
            ],
            options: {
                region: 'DE',
                sizeAxis: {minValue: 0, maxValue: 10}
            }
        };

        this.geoDataReady = true;
    }

    onResize() {
        console.log('Resizing');
    }
}
