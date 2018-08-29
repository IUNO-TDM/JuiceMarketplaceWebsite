import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {TechnologyData} from "../models/technologydata";

@Component({
  selector: 'app-detail-dialog',
  templateUrl: './detail-dialog.component.html',
  styleUrls: ['./detail-dialog.component.css']
})
export class DetailDialogComponent implements OnInit {

  technologydata = new TechnologyData;
  constructor(public dialogRef: MatDialogRef<DetailDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {

      Object.assign(this.technologydata,data);

      if(data.components && data.components.length > 0) {
          this.technologydata['juices'] = [];
          this.technologydata['machines'] = [];
          this.technologydata['materials'] = [];
          for(let component of data.components){
              if(component.attributes){
                  for(let attribute of component.attributes){
                      if(attribute.name == 'juice'){
                          this.technologydata['juices'].push(component);
                          break;
                      }else if(attribute.name == 'machine') {
                          this.technologydata['machines'].push(component);
                          break;
                      }else if(attribute.name == 'material') {
                          this.technologydata['materials'].push(component);
                          break;
                      }
                  }
              }
          }
      }
  }


  ngOnInit() {
  }

}
