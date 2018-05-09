import {Component, OnInit} from '@angular/core';
import {Protocol} from "../../models/Protocol";
import {ClientService} from "../../services/client.service";
import {AdminService} from "../../services/admin.service";
import {Client} from "../../models/Client";
import * as moment from "moment";
import {Observable} from "rxjs/Observable";

@Component({
    selector: 'app-client-requests',
    templateUrl: './client-requests.component.html',
    styleUrls: ['./client-requests.component.css'],
    providers: [AdminService, ClientService]
})
export class ClientRequestsComponent implements OnInit {

    constructor(private adminService: AdminService, private clientService: ClientService) {
    }

    public requestDataReady: boolean = false;
    public requestData: any;


    ngOnInit() {
        const fromDate = moment().startOf('day').toDate();
        const toDate = moment().toDate();

        const lastRecipesObserver = this.adminService.getLastRecipeProtocols(fromDate, toDate);
        const recipesObserver = this.adminService.getRecipeProtocols(fromDate, toDate, 1000);
        const resultObs = lastRecipesObserver.combineLatest(recipesObserver, (lastProtocols, allProtocols) => {
            return {lastProtocols: lastProtocols, allProtocols: allProtocols}
        });

        resultObs.subscribe(
            result => {
                const observables = [];
                for (let i in result.lastProtocols) {
                    observables.push(this.clientService.getClient(result.lastProtocols[i].clientid));
                }

                Observable.forkJoin(observables).subscribe(clients => {
                    this.createChart(clients, result.allProtocols);
                });
            }
        )
    }

    private createChart(clients: Client[], protocols: Protocol[]) {

        const tableHeader = this.createTableHeader(clients);
        const ticks = this.createTicks(clients.length);
        const tableData = this.createTableData(tableHeader, clients, protocols);

        this.requestData = {
            chartType: 'ScatterChart',
            dataTable: tableData,
            options: {
                title: 'Rezeptabfragen am Marktplatz',
                legend: {position: 'right'},
                pointSize: 10,
                vAxis: {
                    minValue: 0,
                    maxValue: clients.length + 1,
                    ticks: ticks
                },
                hAxis: {
                    minValue: 0,
                    maxValue: 25,
                    ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
                },
                series: {
                    0: {
                        'fill-color': '#000080'
                    },
                    1: {
                        'fill-color': '#b70e4d'
                    },
                    2: {
                        'fill-color': '#f1b514'
                    },
                    3: {
                        'fill-color': '#2ccbdc'
                    },
                    4: {
                        'fill-color': '#7eb233'
                    },
                    5: {
                        'fill-color': '#74412f'
                    },
                    6: {
                        'fill-color': '#dba15a'
                    },
                    7: {
                        'fill-color': '#d487ff'
                    },
                    8: {
                        'fill-color': '#e37a22'
                    },
                    9: {
                        'fill-color': '#d5cbe5'
                    },
                    10: {
                        'fill-color': '#000000'
                    }
                }
            }
        };

        this.requestDataReady = true;
    }


    private createTicks(nClients: number): number[] {
        let ticks: number[] = [];

        for (let i = 1; i <= nClients; i++) {
            ticks.push(i);
        }

        return ticks;
    }

    private createTableHeader(clients: Client[]): string[] {
        const header = ['X'];
        for (let i in clients) {
            header.push(clients[i].clientname);
        }
        return header;
    }

    private createTableData(header: string[], clients: Client[], protocols: Protocol[]): any[] {

        const tableData: any[] = [header];


        for (let i in protocols) {
            const protocol = protocols[i];
            const client = clients.find(client => client.id == protocol.clientid);
            const clientIndex = header.indexOf(client.clientname);
            const tableRow = this.createTableRow(header.length, clientIndex, protocol.createat);


            tableData.push(tableRow);
        }

        return tableData;
    }

    private createTableRow(nColumns: number, iColumn: number, date: Date): number[] {
        date = new Date(date);
        const row = [date.getHours() + date.getMinutes() / 60];

        for (let i = 1; i < nColumns; i++) {

            if (i == iColumn) {
                row.push(iColumn);
            }
            else {
                row.push(null);
            }
        }

        return row;
    }
}
