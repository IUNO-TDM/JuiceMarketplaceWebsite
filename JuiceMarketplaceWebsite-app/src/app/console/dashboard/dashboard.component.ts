import {Component, OnInit} from '@angular/core';
import {ViewEncapsulation} from '@angular/core'

import * as moment from 'moment';

import {DashboardService} from '../services/dashboard.service';
import {RecipeReport} from "../models/RecipeReport";
import {EventManager} from "@angular/platform-browser";

@Component({
    selector: 'app-dashboard',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './dashboard.component.html',
    styleUrls: [
        './dashboard.component.css'
    ],
    providers: [DashboardService]
})

export class DashboardComponent implements OnInit {
    topRecipe: RecipeReport = null;
    topRecipeName: string = null;


    topRecipes: RecipeReport[];
    topRecipesData: any;

    constructor(private dashboardService: DashboardService,
                private eventManager: EventManager) {
        eventManager.addGlobalEventListener('window', 'resize',
            (e: any) => {
                this.drawTopRecipes();
            });
    }

    ngOnInit() {

        // pupulate topRecipe
        this.dashboardService.getTopRecipeForUser().subscribe(report => {
            this.topRecipe = report;
            if (report) {
                this.topRecipeName = report.technologydataname;
            } else {
                this.topRecipeName = null;
            }
        }, error2 => {
            console.log(error2);
        });

        let from = moment().startOf('day').subtract(1, 'month').toDate();
        let to = moment().endOf('day').toDate();
        this.dashboardService.getTopRecipes(from, to, 5).subscribe(recipeReports => {
            this.topRecipes = recipeReports;
            this.drawTopRecipes();
        }, error2 => {
            console.log(error2);
        });

    }

    private drawTopRecipes() {
        var data = [];


        data.push(['Rezept', 'Anzahl']);
        // var regions = [{start: reports.length - 1}];
        for (var i in this.topRecipes) {

            data.push([this.topRecipes[i].technologydataname, this.topRecipes[i].amount]);

        }

        this.topRecipesData = {
            chartType: 'BarChart',
            dataTable: data,
            options: {
                legend: {position: 'none'},
                hAxis: {
                    textPosition: 'out'

                },
                bars: 'horizontal',
            }
        };
    }

    contains(container: any, value: any) {
        var returnValue = false;
        var pos = container.indexOf(value);
        if (pos >= 0) {
            returnValue = true;
        }
        return returnValue;
    };

}
