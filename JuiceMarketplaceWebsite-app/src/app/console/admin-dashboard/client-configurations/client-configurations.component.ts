import {Component, OnInit} from '@angular/core';
import {AdminService} from "../../services/admin.service";
import * as moment from "moment";
import {ComponentService} from "tdm-common";

@Component({
    selector: 'app-client-configurations',
    templateUrl: './client-configurations.component.html',
    styleUrls: ['./client-configurations.component.css'],
    providers: [AdminService, ComponentService]
})
export class ClientConfigurationsComponent implements OnInit {

    constructor(private adminService: AdminService, private componentService: ComponentService) {
    }

    public componentDataReady: boolean = false;
    public componentData: any;

    ngOnInit() {

        const fromDate = moment().subtract(1, 'year').toDate();
        const toDate = moment().toDate();

        const componentObservable = this.componentService.availableComponents;
        const protocolObservable = this.adminService.getLastRecipeProtocols(fromDate, toDate);
        const synchedObservable = componentObservable.combineLatest(protocolObservable, (components, protocols) => {
            return {
                components: components,
                protocols: protocols
            }
        });

        synchedObservable.subscribe(result => {

            const components = result.components;
            const protocols = result.protocols;

            const dataTable = [
                ['From', 'To', 'Weight'],
            ];

            for (let iProtocol in protocols) {
                const protocol = protocols[iProtocol];
                const clientName = protocol.payload['client']['clientname'];
                const componentUUIDs = protocol.payload['query'].components;

                for (let iUUID in componentUUIDs) {
                    const component = components.find(component => component.id == componentUUIDs[iUUID]);
                    dataTable.push([clientName, component.name, 1])
                }
            }

            this.componentData = {
                chartType: 'Sankey',
                dataTable: dataTable,
                options: {
                    title: 'Maschinenconfigurationen'
                }
            };

            this.componentDataReady = true;
        })
    }

}
