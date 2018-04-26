import {Component, OnInit} from '@angular/core';
import * as moment from "moment";
import {unitOfTime} from "moment";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/forkJoin'

import {ClientService} from "../../services/client.service";
import {AdminService} from "../../services/admin.service";

@Component({
    selector: 'app-connected-clients',
    templateUrl: './connected-clients.component.html',
    styleUrls: ['./connected-clients.component.css'],
    providers: [AdminService, ClientService]
})
export class ConnectedClientsComponent implements OnInit {

    constructor(private adminService: AdminService, private clientService: ClientService) {

    }

    connectionObservable1: Observable<Object>;
    connectionObservable2: Observable<Object>;
    connectionObservableC: Observable<Object>;

    scopeOffset = 0;
    scopeFromLabel: string;
    scopeToLabel: string;

    connectedChartOption = 'week';
    connectedChartDisabled = false;
    machinesConnectedData: any;

    createConnectionDiagram(from: Date, to: Date, data: any, lastdata: any, clients: Array<Object>) {
        this.machinesConnectedData.dataTable = [];
        if (data.length == 0) {

            var isOneConnected = false;
            for (let d of lastdata) {
                if (d.payload.connected == true) {
                    isOneConnected = true;
                }
            }
            if (!isOneConnected || lastdata.length == 0) {
                this.connectedChartDisabled = true;
                return;
            }
        }

        this.connectedChartDisabled = false;
        this.machinesConnectedData.dataTable.push(
            ['Name', 'From', 'To']);
        data.reverse();
        var clientList = {};
        for (let client of clients) {
            clientList[client['id']] = client['clientname'];
        }

        let sortedByMachine = {};
        let machineLastConnectedState = {};
        for (let line of data) {
            if (!sortedByMachine.hasOwnProperty(line.clientid)) {
                sortedByMachine[line.clientid] = [];
                if (!line.payload.connected) {
                    sortedByMachine[line.clientid].push(from);
                    machineLastConnectedState[line.clentid] = false;
                }
            }

            if (machineLastConnectedState.hasOwnProperty(line.clientid)) {
                if (line.payload.connected === machineLastConnectedState[line.clientid]) {
                    if (line.payload.connected === false) { //doubled not connected entries should be skipped
                        continue;
                    }
                    machineLastConnectedState[line.clientid] = !line.payload.connected;
                    sortedByMachine[line.clientid].push(new Date(line.sourcetimestamp));
                }
            }

            machineLastConnectedState[line.clientid] = line.payload.connected;
            sortedByMachine[line.clientid].push(new Date(line.sourcetimestamp));


        }
        for (let line of lastdata) {
            if (line.payload.connected && !sortedByMachine.hasOwnProperty(line.clientid)) {
                sortedByMachine[line.clientid] = [];
                sortedByMachine[line.clientid].push(from);
            }
        }

        for (let machine in sortedByMachine) {
            if (sortedByMachine[machine].length % 2 != 0) {
                sortedByMachine[machine].push(new Date());
            }

            for (let i = 0; i < sortedByMachine[machine].length; i += 2) {
                let graphline = [];
                if (clientList.hasOwnProperty(machine)) {
                    graphline.push(clientList[machine]);
                } else {
                    graphline.push(machine);
                }

                graphline.push(sortedByMachine[machine][i]);
                graphline.push(sortedByMachine[machine][i + 1]);
                this.machinesConnectedData.dataTable.push(graphline);
            }
        }

        this.machinesConnectedData.options['hAxis'] = {minValue: from, maxValue: to};
        this.machinesConnectedData.options['height'] = Object.keys(machineLastConnectedState).length * 38 + 80;

        this.connectedChartDisabled = false;
    }

    acquireConnectionProtocol() {
        this.connectedChartDisabled = true;

        let from: Date;
        let to: Date;
        let lcfrom: Date;
        let lcto: Date;
        switch (this.connectedChartOption) {
            case 'day':
                from = moment().startOf('day').subtract(this.scopeOffset, 'day').toDate();
                to = moment().endOf('day').subtract(this.scopeOffset, 'day').toDate();

                lcfrom = moment().startOf('day').subtract(this.scopeOffset, 'day').subtract(1, 'month').toDate();
                lcto = moment().endOf('day').subtract(this.scopeOffset, 'day').toDate();

                break;
            case 'week':
                from = moment().startOf('week').subtract(this.scopeOffset, 'week').toDate();
                to = moment().endOf('week').subtract(this.scopeOffset, 'week').toDate();

                lcfrom = moment().startOf('week').subtract(this.scopeOffset, 'week').subtract(1, 'month').toDate();
                lcto = moment().endOf('week').subtract(this.scopeOffset, 'week').toDate();

                break;
            case 'month':
                from = moment().startOf('month').subtract(this.scopeOffset, 'month').toDate();
                to = moment().endOf('month').subtract(this.scopeOffset, 'month').toDate();


                lcfrom = moment().startOf('month').subtract(this.scopeOffset + 2, 'month').toDate();
                lcto = moment().endOf('month').subtract(this.scopeOffset, 'month').toDate();

                break;
            case 'year':
                from = moment().startOf('year').subtract(this.scopeOffset, 'year').toDate();
                to = moment().endOf('year').subtract(this.scopeOffset, 'year').toDate();


                lcfrom = moment().startOf('year').subtract(this.scopeOffset + 2, 'year').toDate();
                lcto = moment().endOf('year').subtract(this.scopeOffset, 'year').toDate();

                break;
        }

        this.machinesConnectedData = {
            chartType: 'Timeline',
            dataTable: [
                ['Name', 'From', 'To'],
                ['nix', from, to]

            ],
            options: {
                title: 'Aktivität der Maschinen',
                timeline: {
                    groupByRowLabel: true
                }
            }
        };


        this.scopeFromLabel = from.toLocaleDateString();
        this.scopeToLabel = to.toLocaleDateString();

        this.connectionObservable1 = this.adminService.getConnectionProtocols(from, to, 10000);
        this.connectionObservable2 = this.adminService.getLastConnectionProtocols(lcfrom, lcto);
        this.connectionObservableC = this.connectionObservable1.combineLatest(this.connectionObservable2, (x, y) => {
            return {a: x, b: y}
        });

        this.connectionObservableC.subscribe(d => {

            const observables = [];
            for (let client of d['b']) {
                observables.push(this.clientService.getClient(client['clientid']));
            }

            Observable.forkJoin(observables).subscribe(clients => {
                this.createConnectionDiagram(from, to, d['a'], d['b'], clients)
            });


        }, error2 => console.log(error2));


    }

    ngOnInit() {
        this.acquireConnectionProtocol();
    }

    ngAfterViewInit() {
    }

    resetScope() {
        this.scopeOffset = 0;
        this.acquireConnectionProtocol();
    }

    pastData() {
        this.scopeOffset++;
        this.acquireConnectionProtocol();
    }

    futureData() {

        const future = moment().startOf(this.connectedChartOption as unitOfTime.StartOf).subtract(this.scopeOffset - 1, this.connectedChartOption as unitOfTime.DurationConstructor);
        const today = moment();

        if (today.diff(future) < 0) {
            return;
        }

        this.scopeOffset--;

        this.acquireConnectionProtocol();
    }

}
