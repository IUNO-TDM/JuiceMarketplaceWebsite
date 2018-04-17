import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as moment from 'moment';
import {Recipe} from 'tdm-common';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import {RevenueReport} from "../models/RevenueReport";
import {RecipeReport} from "../models/RecipeReport";


@Injectable()
export class DashboardService {
    constructor(private http: HttpClient) {
    }

    getTopRecipeForUser(): Observable<RecipeReport> {
        var limit = 1;
        var fromDate = moment().utc().year(2000).format();
        var toDate = moment().utc().format();
        var url = '/api/users/me/reports/recipes/top?limit=' + limit + '&from=' + fromDate + '&to=' + toDate;
        return this.http.get<RecipeReport[]>(url).flatMap(reports => {
            if (reports.length > 0) {
                return Observable.of(reports[0] || 0);
            } else {
                return Observable.of(null);
            }
        });
    }

    getTopRecipes(from: Date, to: Date, limit: number): Observable<RecipeReport[]> {
        let fromDate = moment.utc([from.getFullYear(),from.getMonth(), from.getDate(),from.getHours(), from.getMinutes(), from.getSeconds()]);
        let toDate = moment.utc([to.getFullYear(),to.getMonth(), to.getDate(),to.getHours(), to.getMinutes(), to.getSeconds()]);
        let url = '/api/reports/recipes/top?from=' + fromDate.format() + '&to=' + toDate.format() + '&limit=' + limit;
        return this.http.get(url).map((data: any[]) => {
            var reports: RecipeReport[] = data;
            return reports;
        })
    }

    getRevenueHistoryForUser(from: Date, to: Date): Observable<RevenueReport[]> {
        let fromDate = moment.utc([from.getFullYear(),from.getMonth(), from.getDate(),from.getHours(), from.getMinutes(), from.getSeconds()]);
        let toDate = moment.utc([to.getFullYear(),to.getMonth(), to.getDate(),to.getHours(), to.getMinutes(), to.getSeconds()]);
        let url = '/api/users/me/reports/revenue/history?from=' + fromDate.format()  + '&to=' + toDate.format()  ;
        var result = this.http.get<any[]>(url).map((data: any) => {

            var reports = new Array<RevenueReport>(data.length);
            for (var i in data) {
                let r = new RevenueReport();
                r.revenue = Number.parseFloat(data[i].revenue);
                r.startDate = moment(data[i].date).startOf('day').toDate();
                r.endDate = moment(r.startDate).endOf('day').toDate();
                r.technologydataname = data[i].technologydataname;
                reports[i] = r;
            }
            return reports;
        });
        return result;
    }

    getRevenueForUser(from: Date, to: Date) {
        let fromDate = moment.utc([from.getFullYear(),from.getMonth(), from.getDate(),from.getHours(), from.getMinutes(), from.getSeconds()]);
        let toDate = moment.utc([to.getFullYear(),to.getMonth(), to.getDate(),to.getHours(), to.getMinutes(), to.getSeconds()]);
        let url = '/api/users/me/reports/revenue?from=' + fromDate.format() + '&to=' + toDate.format();
        return this.http.get(url).flatMap(res => {
            return Observable.of(res[0].revenue || 0);
        });
    }

    getLicenseCountForUser(from: Date, to: Date) {
        let fromDate = moment.utc([from.getFullYear(),from.getMonth(), from.getDate(),from.getHours(), from.getMinutes(), from.getSeconds()]);
        let toDate = moment.utc([to.getFullYear(),to.getMonth(), to.getDate(),to.getHours(), to.getMinutes(), to.getSeconds()]);
        let url = '/api/users/me/reports/revenue?from=' + fromDate.format() + '&to=' + toDate.format();
        return this.http.get(url).flatMap(res => {
            return Observable.of(res[0].amount || 0);
        });
    }




    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

}
