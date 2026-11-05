import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import * as moment from 'moment';
import 'rxjs/add/operator/map'
import {ComponentReport} from "../models/ComponentReport";
import {RecipeReport} from "../models/RecipeReport";

@Injectable()
export class StatisticsService {    
    constructor(private http: HttpClient) {
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