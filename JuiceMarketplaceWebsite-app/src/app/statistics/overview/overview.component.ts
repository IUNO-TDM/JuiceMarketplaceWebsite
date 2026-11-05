import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {StatisticsService} from "../services/statistics.service";
import * as moment from 'moment';
import {ComponentReport} from "../models/ComponentReport";
import {RecipeReport} from "../models/RecipeReport";
import { EventManager } from '@angular/platform-browser';
import * as async from "async";

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.css'],
    providers: [StatisticsService]
})
export class OverviewComponent implements OnInit {


    getColorForComponent(componentName: string): string {
        var color;

        switch (componentName) {
            case 'Mineralwasser':
                color = '#25e2ff';
                break;
            case 'Kirschsaft':
                color = '#900006';
                break;
            case 'Orangensaft':
                color = '#ffb100';
                break;
            case 'Maracujasaft':
                color = '#ff9a00';
                break;
            case 'Ananassaft':
                color = '#fff100';
                break;
            case 'Bananensaft':
                color = '#fffd84';
                break;
            case 'Apfelsaft':
                color = '#ffae7e';
                break;
            case 'Mangosaft':
                color = '#ffc413';
                break;
            case 'Advents-Früchtetee':
                color = '#ff2600';
                break;
            case 'Havana Club (RUM)':
                color = '#ffc900';
                break;

            default:
                color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
                break;
        }

        return color;
    }

    constructor(private router: Router, private activatedRoute: ActivatedRoute,
                private statisticsService: StatisticsService, private eventManager: EventManager) {
        eventManager.addGlobalEventListener('window', 'resize',
            (e: any) => {
                this.drawAllTimeTopRecipes()
                this.drawComponentReports()
                this.drawTodayTopRecipes()
            });
    }

    componentreports: ComponentReport[];
    allTimeTopRecipes: RecipeReport[];
    todayTopRecipes: RecipeReport[];
    topComponentsData: any;
    allTimeTopRecipesData: any;
    todayTopRecipesData: any;

    ngOnInit() {
        let from1 = moment([2010]).toDate()
        let to1 = moment().utc().endOf('day').toDate();
        this.statisticsService.getTopComponents(from1, to1, 10).subscribe(reports => {
            this.componentreports = reports;
            this.drawComponentReports();

        }, error2 => {
            console.log(error2)
        })

        let from2 = moment([2010]).toDate()
        let to2 = moment().utc().endOf('day').toDate();
        this.statisticsService.getTopRecipes(from2, to2, 10).subscribe(reports => {
            this.allTimeTopRecipes = reports;
            this.drawAllTimeTopRecipes();

        }, error2 => {
            console.log(error2)
        })

        let from3 = moment().utc().startOf('day').toDate();
        let to3 = moment().utc().endOf('day').toDate();
        this.statisticsService.getTopRecipes(from3, to3, 10).subscribe(reports => {
            this.todayTopRecipes = reports;
            this.drawTodayTopRecipes();

        }, error2 => {
            console.log(error2)
        })


    }

    private drawComponentReports() {

        var data = [];


        data.push(['Zutat', 'Verwendung in Getränken', {role: 'style'}]);
        // var regions = [{start: reports.length - 1}];
        for (var i in this.componentreports) {

            data.push([this.componentreports[i].componentname, this.componentreports[i].amount,
                this.getColorForComponent(this.componentreports[i].componentname)]);

        }

        this.topComponentsData = {
            chartType: 'ColumnChart',
            dataTable: data,
            options: {
                legend: {position: 'none'},
                vAxis: {
                    minValue: 0,
                    gridlines: {count: -1}

                }
            }
        };
    }

    private drawAllTimeTopRecipes( ) {
        var data = [];


        data.push(['Rezept', 'Anzahl']);
        // var regions = [{start: reports.length - 1}];
        for (var i in this.allTimeTopRecipes) {

            data.push([this.allTimeTopRecipes[i].technologydataname, this.allTimeTopRecipes[i].amount]);

        }

        this.allTimeTopRecipesData = {
            chartType: 'BarChart',
            dataTable: data,
            options: {
                legend: {position: 'none'},
                hAxis: {
                    minValue: 0,
                    format: '#'

                },
                bars: 'horizontal'
            }
        };
    }

    private drawTodayTopRecipes() {
        var x = [];
        x[0] = 'x';
        var data = [];


        data.push(['Rezept', 'Anzahl']);
        // var regions = [{start: reports.length - 1}];
        for (var i in this.todayTopRecipes) {

            data.push([this.todayTopRecipes[i].technologydataname, this.todayTopRecipes[i].amount]);

        }

        this.todayTopRecipesData = {
            chartType: 'BarChart',
            dataTable: data,
            options: {
                legend: {position: 'none'},
                hAxis: {
                    minValue: 0,
                    format: '#'

                },
                bars: 'horizontal'
            }
        };
    }
}
