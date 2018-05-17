import { Component, OnInit } from '@angular/core';
import {VisualizationSocketService} from "../services/visualization-socket.service";

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.css'],
    providers:[VisualizationSocketService]
})
export class VisualizationComponent implements OnInit {

  constructor(private visualizationSocketService: VisualizationSocketService) { }

  ngOnInit() {

      this.visualizationSocketService.getUpdates('machineconnection').subscribe(data =>{
          console.log("MachineConnection: connected=" + data.connected);
      });
      this.visualizationSocketService.getUpdates('offerrequest').subscribe(data =>{
          console.log("OfferRequest: " + data.items[0].dataId);
      });
      this.visualizationSocketService.getUpdates('payment').subscribe(data =>{
          console.log("Payment: " + data.payment.confidenceState);
      });
      this.visualizationSocketService.getUpdates('payingtransactions').subscribe(data =>{
          console.log("PayingTransactions: " + data.transactions[0].transaction);
      });
      this.visualizationSocketService.getUpdates('productionState').subscribe(data =>{
          console.log("ProductionState: " + data.state.state);
      });
      this.visualizationSocketService.getUpdates('licenseAvailable').subscribe(data =>{
          console.log("LicenseAvailable: " + data.hsmId);
      });
      this.visualizationSocketService.getUpdates('licenseupdate').subscribe(data =>{
          console.log("LicenseUpdate: " + data.hsmId);
      });
      this.visualizationSocketService.getUpdates('licenseupdateconfirm').subscribe(data =>{
          console.log("LicenseUpdateConfirm: " + data.hsmId);
      });
  }

}
