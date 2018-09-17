import {
  Component,
  OnInit,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';
import { TechnologyData } from '../models/technologydata';
import { TechnologydataService } from '../services/technologydata.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'gallery-detail',
  templateUrl: './gallery-detail.component.html',
  styleUrls: ['./gallery-detail.component.css'],
})
export class GalleryDetailComponent implements OnInit, OnChanges {
  @Output()
  onBack = new EventEmitter();
  @Input()
  technologyDataId: string;

  _techData = new TechnologyData();
  private _originTechData: TechnologyData;

  private techDataSubscription: Subscription;

  constructor(private technologyDataService: TechnologydataService) {}

  ngOnInit() {}

  backClicked() {
    this.onBack.emit(null);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['technologyDataId']) {
      if (this.techDataSubscription) {
        this.techDataSubscription.unsubscribe();
      }
      if (this.technologyDataId) {
        this.techDataSubscription = this.technologyDataService
          .technologyDataById(this.technologyDataId)
          .subscribe(techData => {
            Object.assign(this._techData, techData);
            this._originTechData = techData;
            if (techData.components && techData.components.length > 0) {
              this._techData['juices'] = [];
              this._techData['machines'] = [];
              this._techData['materials'] = [];
              for (let component of techData.components) {
                if (component.attributes) {
                  for (let attribute of component.attributes) {
                    if (attribute.name === 'juice') {
                      this._techData['juices'].push(component);
                      break;
                    } else if (attribute.name === 'machine') {
                      this._techData['machines'].push(component);
                      break;
                    } else if (attribute.name === 'material') {
                      this._techData['materials'].push(component);
                      break;
                    }
                  }
                }
              }
            }
          });
      }
    }
  }
}
