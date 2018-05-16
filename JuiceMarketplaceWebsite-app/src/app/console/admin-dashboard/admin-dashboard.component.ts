import { Component, OnInit } from '@angular/core';
import {VisualizationSocketService} from "../services/visualization-socket.service";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
    providers: [VisualizationSocketService]
})
export class AdminDashboardComponent implements OnInit {

  constructor(private visualizationSocketService: VisualizationSocketService) { }

  ngOnInit() {
    this.visualizationSocketService.getUpdates('test').subscribe(test =>{
      console.log(test);
    });
  }

}
