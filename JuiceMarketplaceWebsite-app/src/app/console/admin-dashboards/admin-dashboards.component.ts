import {Component, OnInit, ViewChild} from '@angular/core';
import {AdminService} from "../services/admin.service";
import * as moment from "moment";
import {GoogleChartComponent} from "ng2-google-charts";
import {Observable} from "rxjs/Observable";
import {ClientService} from "../services/client.service";
import 'rxjs/add/observable/forkJoin'
@Component({
    selector: 'app-admin-dashboards',
    templateUrl: './admin-dashboards.component.html',
    styleUrls: ['./admin-dashboards.component.css'],
    providers: [AdminService, ClientService]
})
export class AdminDashboardsComponent implements OnInit {

    constructor(private adminService: AdminService,private clientService: ClientService) {
    }

    @ViewChild('timelinechart') timelinechart: GoogleChartComponent;

    connectionObservable1: Observable<Object>;
    connectionObservable2: Observable<Object>;
    connectionObservableC: Observable<Object>;


    connectedChartOption = 'week';
    connectedChartDisabled = false;
    machinesConnectedData = {
        chartType: 'Timeline',
        dataTable: [
            [ {type: 'string', id: 'Role'},
                {type: 'date', id: 'Start'},
                {type: 'date', id: 'End'}]
        ],
        options: {
            title: 'Aktivität der Maschinen',
            timeline: {
                groupByRowLabel: true
            }
        }
    };


    machinesGeolocationData = {
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

    componentConfigurationData = {
        chartType: "Sankey",
        dataTable: [
            ['From', 'To', 'Weight'],
            ['A', 'Mineralwasser', 1],
            ['A', 'Orangensaft', 1],
            ['A', 'Apfelsaft', 1],
            ['A', 'Mangosaft', 1],
            ['A', 'Maracujasaft', 1],
            ['A', 'Ananassaft', 1],
            ['A', 'Bananensaft', 1],
            ['A', 'Kirschsaft', 1],
            ['B', 'Mineralwasser', 1],
            ['B', 'Orangensaft', 1],
            ['B', 'Apfelsaft', 1],
            ['B', 'Mangosaft', 1],
            ['B', 'Maracujasaft', 1],
            ['B', 'Ananassaft', 1],
            ['B', 'Bananensaft', 1],
            ['B', 'Limettensaft', 1],
            ['C', 'Mineralwasser', 1],
            ['C', 'Orangensaft', 1],
            ['C', 'Apfelsaft', 1],
            ['C', 'Mangosaft', 1],
            ['C', 'Maracujasaft', 1],
            ['C', 'Rum', 1],
            ['C', 'Wodka', 1],
            ['C', 'Limettensaft', 1]
        ],
        options: {
            width: 600
        }
    };

    createConnectionDiagram(from: Date, to: Date, data: any, lastdata: any, clients: Array<Object>) {
        this.machinesConnectedData.dataTable = [];
        if (data.length == 0) {

            var isOneConnected = false;
            for(let d of lastdata){
                if(d.payload.connected == true){
                    isOneConnected = true;
                }
            }
            if(!isOneConnected || lastdata.length == 0){
                this.connectedChartDisabled = true;
                return;
            }
            this.connectedChartDisabled = true;
            return;
        }

        this.connectedChartDisabled = false;
        this.machinesConnectedData.dataTable.push(
            [
                {type: 'string', id: 'Role'},
                {type: 'date', id: 'Start'},
                {type: 'date', id: 'End'}
            ]);
        data.reverse();
        var clientList = {};
        for(let client of clients){
            clientList[client['id']] = client['clientname'];
        }

        let sortedByMachine = {};
        for (let line of data) {
            if (!sortedByMachine.hasOwnProperty(line.clientid)) {
                sortedByMachine[line.clientid] = [];
                if (!line.payload.connected) {
                    sortedByMachine[line.clientid].push(from);
                }
            }
            sortedByMachine[line.clientid].push(new Date(line.sourcetimestamp));


        }
        for(let line of lastdata){
            if (line.payload.connected && !sortedByMachine.hasOwnProperty(line.clientid)){
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
                if(clientList.hasOwnProperty(machine)){
                    graphline.push(clientList[machine]);
                }else{
                    graphline.push(machine);
                }

                graphline.push(sortedByMachine[machine][i]);
                graphline.push(sortedByMachine[machine][i + 1]);
                this.machinesConnectedData.dataTable.push(graphline);
            }


        }
        this.machinesConnectedData.options['hAxis'] = {minValue: from, maxValue: to};
        this.timelinechart.redraw();

    }

    acquireConnectionProtocol() {

        let from: Date;
        let to: Date;
        let lcfrom: Date;
        let lcto: Date;
        switch (this.connectedChartOption) {
            case 'day':
                from = moment().startOf('day').toDate();
                to = moment().endOf('day').toDate();

                lcfrom = moment().startOf('day').subtract(1, 'month').toDate();
                lcto = moment().endOf('day').toDate();

                break;
            case 'week':
                from = moment().startOf('day').subtract(1, 'week').toDate();
                to = moment().endOf('day').toDate();

                lcfrom = moment().startOf('day').subtract(1, 'month').toDate();
                lcto = moment().endOf('day').toDate();

                break;
            case 'month':
                from = moment().startOf('day').subtract(1, 'month').toDate();
                to = moment().endOf('day').toDate();


                lcfrom = moment().startOf('day').subtract(2, 'month').toDate();
                lcto = moment().endOf('day').toDate();

                break;
            case 'year':
                from = moment().startOf('day').subtract(1, 'year').toDate();
                to = moment().endOf('day').toDate();


                lcfrom = moment().startOf('day').subtract(2, 'year').toDate();
                lcto = moment().endOf('day').toDate();

                break;
        }


        this.connectionObservable1 = this.adminService.getConnectionProtocols(from, to);
        this.connectionObservable2  = this.adminService.getLastConnectionProtocols(lcfrom, lcto);
        this.connectionObservableC = this.connectionObservable1.combineLatest(this.connectionObservable2,(x,y)=>{return {a:x,b:y}});

        this.connectionObservableC.subscribe(d => {

            var observables = [];
            for(let client of d['b']) {
                observables.push(this.clientService.getClient(client['clientid']));
            }

            Observable.forkJoin(observables).subscribe(clients =>{
                this.createConnectionDiagram(from, to, d['a'], d['b'],clients)
            });


        }, error2 => console.log(error2));


    }

    ngOnInit() {
        this.acquireConnectionProtocol()

    }


}



