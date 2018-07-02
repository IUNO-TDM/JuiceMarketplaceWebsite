import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {RevenueReport} from "../models/RevenueReport";
import {Observable} from "rxjs/Observable";
import * as moment from 'moment';
import 'rxjs/add/operator/map'
import {ComponentReport} from "../models/ComponentReport";
import {RecipeReport} from "../models/RecipeReport";
import {by} from "protractor";

@Injectable()
export class StatisticsService {    
    constructor(private http: HttpClient) {
    }

    getRevenueReport(from: Date, to: Date, byHour: boolean): Observable<RevenueReport[]> {


        let fromStr = moment(from).utc().format();
        let toStr = moment(to).utc().format();
        let detail = 'day';
        if (byHour) {
            detail = 'hour';
        }
        let url = '/api/reports/revenue?from=' + fromStr + '&to=' + toStr + '&detail=' + detail;
        return this.http.get(url).map((data: any[]) => {
            var reports = new Array<RevenueReport>(data.length);
            for (var i in data) {
                let r = new RevenueReport();
                r.amount = Number.parseInt(data[i].amount);
                r.revenue = Number.parseFloat(data[i].revenue);
                if(byHour){
                    r.startDate = moment(data[i].date).toDate();
                    r.endDate = moment(r.startDate).add(1, 'hour').toDate();
                }else{
                    r.startDate = moment(data[i].date).toDate();
                    r.endDate = moment(r.startDate).endOf('day').toDate();
                }

                reports[i] = r;
            }
            return reports;
        })
    }

    getTopComponents(from: Date, to: Date, limit: number): Observable<ComponentReport[]> {

        let fromStr = moment(from).utc().format();
        let toStr = moment(to).utc().format();
        let url = '/api/reports/components/top?from=' + fromStr + '&to=' + toStr + '&limit=' + limit;
        return this.http.get(url).map((data: any[]) => {
            var reports: ComponentReport[] = data;
            return reports;
        })
    }

    getTopRecipes(from: Date, to: Date, limit: number): Observable<RecipeReport[]>{
        let fromStr = moment(from).utc().format();
        let toStr = moment(to).utc().format();
        let url = '/api/reports/recipes/top?from=' + fromStr + '&to=' + toStr + '&limit=' + limit;
        return this.http.get(url).map((data: any[]) => {
            var reports: RecipeReport[] = data;
            return reports;
        })
    }


}