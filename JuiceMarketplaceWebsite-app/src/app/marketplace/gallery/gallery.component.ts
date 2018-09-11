import { Component, OnInit } from '@angular/core';
import { TechnologydataService } from '../services/technologydata.service';
import { TechnologyData } from '../models/technologydata';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
  providers: [TechnologydataService],
})
export class GalleryComponent implements OnInit {
  technologyData: TechnologyData[];
  selectedTechDataId: string;

  TESTING_ULTIMAKER_TECHNOLOGY_UUID = 'adb4c297-45bd-437e-ac90-2aed14f6b882';
  PRODUCTIVE_ULTIMAKER_TECHNOLOGY_UUID = 'f6589569-c5c5-4567-ac53-97dc9afda09f';
  TESTING_COCKTAIL_TECHNOLOGY_UUID = 'da17a8fc-a5b3-40a4-b6a5-276667db027a';
  PRODUCTIVE_COCKTAIL_TECHNOLOGY_UUID = '1087cb7b-e017-4379-81dc-0ab214b6e210';

  constructor(
    private technologDataService: TechnologydataService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    route.params.subscribe(params => {
      this.selectedTechDataId = params['id'];
      console.log(this.selectedTechDataId);
    });
  }

  ngOnInit() {
    this.technologDataService.updateTechnologyData();
    this.technologDataService.technologyData.subscribe(
      td => (this.technologyData = td),
    );
  }

  onCardSelect(object: any) {
    this.router.navigateByUrl('marketplace/gallery/' + object.id);
  }

  detailBack() {
    this.router.navigateByUrl('marketplace/gallery/');
  }
}
