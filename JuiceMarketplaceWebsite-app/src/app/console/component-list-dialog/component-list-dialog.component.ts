import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CocktailComponent, ComponentService } from 'tdm-common';

@Component({
  selector: 'cocktail-component-list-dialog',
  templateUrl: './component-list-dialog.component.html',
  styleUrls: ['./component-list-dialog.component.css']
})
export class ComponentListDialogComponent implements OnInit {
  public showRecommended = true
  public showInstalled = true
  public showAvailable = true

  constructor(
    public dialogRef: MatDialogRef<ComponentListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.showRecommended != undefined) {
      this.showRecommended = data.showRecommended;
    }
    if (data.showInstalled != undefined) {
      this.showInstalled = data.showInstalled;
    }
    if (data.showAvailable != undefined) {
      this.showAvailable = data.showAvailable;
    }
  }

  ngOnInit() {
  }

  onComponentSelected(component: CocktailComponent) {
    this.dialogRef.close(component);
  }

  onCancel() {
    this.dialogRef.close(null);
  }

}
