import {Component, OnInit} from '@angular/core';
import {AdminService} from "../../services/admin.service";
import {ClientService} from "../../services/client.service";
import {Observable} from "rxjs/Observable";
import {ChartMouseOverEvent, ChartSelectEvent} from "ng2-google-charts";
import {Protocol} from "../../models/Protocol";

@Component({
    selector: 'app-client-map',
    templateUrl: './client-map.component.html',
    styleUrls: ['./client-map.component.css'],
    providers: [AdminService, ClientService]
})
export class ClientMapComponent implements OnInit {

    private locationProtocols: Protocol[];

    public geoDataReady: boolean = false;
    public geoData: any;

    constructor(private adminService: AdminService, private clientService: ClientService) {
    }

    ngOnInit() {
        this.loadGeoData();
    }


    loadGeoData() {
        this.adminService.getLastLocation().subscribe(
            data => {
                const observables = [];
                for (let i in data) {
                    observables.push(this.clientService.getClient(data[i].clientid));
                }

                this.locationProtocols = data;

                Observable.forkJoin(observables).subscribe(clients => {

                    const dataTable = [
                        ['Lat', 'Long', 'Client']
                    ];

                    for (let i in data) {

                        if (!data[i].payload['latitude'] || !data[i].payload['longitude']) {
                            continue;
                        }

                        dataTable.push(
                            [
                                data[i].payload['latitude'],
                                data[i].payload['longitude'],
                                clients.find(x => x.id == data[i].clientid).clientname
                            ]
                        );
                    }

                    this.geoData = {
                        chartType: 'GeoChart',
                        apiKey: 'AIzaSyDlZ5Yh79toiIzEV_NIQGX8F42663WGTxg',
                        dataTable: dataTable,
                        options: {
                            region: 'DE'
                        }
                    };

                    this.geoDataReady = true;
                });

            },
            error => {
                console.log(error);
            }
        )
    }

    onResize() {
        console.log('Resizing');
    }
}
