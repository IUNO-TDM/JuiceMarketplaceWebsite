import {Component, OnInit} from '@angular/core';
import {ViewEncapsulation} from '@angular/core'

import * as moment from 'moment';

import {DashboardService} from '../services/dashboard.service';
import {Recipe} from 'tdm-common';
import {RevenueReport} from "../models/RevenueReport";
import * as async from 'async';
import {RecipeReport} from "../models/RecipeReport";
import {EventManager} from "@angular/platform-browser";
import {VaultService} from "../services/vault.service";

@Component({
    selector: 'app-dashboard',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './dashboard.component.html',
    styleUrls: [
        './dashboard.component.css'
    ],
    providers: [DashboardService, VaultService]
})

export class DashboardComponent implements OnInit {
    amountToday: number = null;
    topRecipe: Recipe = null;
    topRecipeName: string = null;


    revenueHistory: RevenueReport[];
    revenueHistoryData: any;

    topRecipes: RecipeReport[];
    topRecipesData: any;
    vaultBalance = 0;

    constructor(private dashboardService: DashboardService,
                private eventManager: EventManager,
                private vaultService: VaultService) {
        eventManager.addGlobalEventListener('window', 'resize',
            (e: any) => {
                this.drawRevenueChart();
                this.drawTopRecipes();
            });
    }

    ngOnInit() {

        // pupulate topRecipe
        this.dashboardService.getTopRecipeForUser().subscribe(recipe => {
            console.log(recipe);
            this.topRecipe = recipe;
            if (recipe) {
                //TODO: use recipe.name after issue #133 was fixed
                this.topRecipeName = recipe.technologydataname;
            } else {
                this.topRecipeName = null;
            }
        }, error2 => {
            console.log(error2);
        });

        let fromToday = moment().startOf('day').toDate();
        let toToday = moment().endOf('day').toDate();
        this.dashboardService.getLicenseCountForUser(fromToday, toToday).subscribe(amount => {
            this.amountToday = amount;
        }, error2 => {
            console.log(error2);
        });


        let from = moment().startOf('day').subtract(1, 'month').toDate();
        let to = moment().endOf('day').toDate();
        this.dashboardService.getRevenueHistoryForUser(from, to).subscribe(revenues => {
            this.revenueHistory = revenues;
            this.drawRevenueChart();
        }, error2 => {
            console.log(error2);
        });

        from = moment().startOf('day').subtract(1, 'month').toDate();
        to = moment().endOf('day').toDate();
        this.dashboardService.getTopRecipes(from, to, 5).subscribe(recipes => {
            this.topRecipes = recipes;
            this.drawTopRecipes();
        }, error2 => {
            console.log(error2);
        });

        this.vaultService.getVaultBalance().subscribe(balance => {
            this.vaultBalance = balance / 100000;
        }, error2 => console.log(error2));

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

    private drawRevenueChart() {

        var data: any[][] = [];
        var series = {};
        var columns: any[][] = [];
        var techNames: string[] = [];
        var techcount = 0;
        var self = this;
        columns[0] = ["Datum"];
        async.each(this.revenueHistory, function (revenue: RevenueReport, callback) {
            if (-1 == columns[0].findIndex((element) => {
                    return element.getTime && element.getTime() == moment(revenue.startDate).toDate().getTime()
                })) {
                columns[0].push(moment(revenue.startDate).toDate());
            }
            // if (!self.contains(columns[0], moment(revenue.endDate).milliseconds())) {
            //     columns[0].push(moment(revenue.endDate).milliseconds());
            // }
            if (!self.contains(techNames, revenue.technologydataname)) {
                techNames.push(revenue.technologydataname);
                techcount += 1;
                columns.push([revenue.technologydataname]);
                if (revenue.technologydataname === "Benchmark") {
                    series[(techcount - 1).toString()] = {type: 'line', lineDashStyle: [8, 8], lineWidth: 4};
                } else {
                    series[(techcount - 1).toString()] = {type: 'area'};
                }

            }

            columns[techcount].push(revenue.revenue / 100000);
            callback();
        }, function (err) {

            // for (var t in techNames) {
            //     data[0].push(techNames[t]);
            // }
            for (var r in columns[0]) {
                data.push([]);
                for (var c in columns) {
                    data[r].push(columns[c][r]);
                }
            }


            self.revenueHistoryData = {
                chartType: 'ComboChart',
                dataTable: data,
                options: {
                    axisTitlesPosition: 'in',
                    legend: {position: 'bottom'},
                    hAxis: {
                        format: 'dd.MM.'
                    },
                    vAxis: {
                        title: 'Umsatz (IUNO)'
                    },
                    series: series
                }


            }

        });


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
