import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import * as moment from "moment";
import {Protocol} from "../models/Protocol";
import {Moment} from "moment";

@Injectable()
export class AdminService {

    constructor(private http: HttpClient) {
    }

    private getProtocols(eventType: string, from: Moment, to: Moment, limit:number): Observable<Protocol[]> {
        const url = `/api/admin/protocols?eventType=${eventType}&from=${from.format()}&to=${to.format()}&limit=${limit}`;
        return this.http.get<Protocol[]>(url);
    }

    private getLastProtocols(eventType: string, from: Moment, to: Moment): Observable<Protocol[]> {
        const url = `/api/admin/protocols/last?eventType=${eventType}&from=${from.format()}&to=${to.format()}`;
        return this.http.get<Protocol[]>(url);
    }


    getConnectionProtocols(from: Date, to: Date, limit: number): Observable<Protocol[]> {
        const fromDate = moment.utc([from.getFullYear(), from.getMonth(), from.getDate(), from.getHours(), from.getMinutes(), from.getSeconds()]);
        const toDate = moment.utc([to.getFullYear(), to.getMonth(), to.getDate(), to.getHours(), to.getMinutes(), to.getSeconds()]);

        return this.getProtocols('connection', fromDate, toDate, limit);
    }

    getLastConnectionProtocols(from: Date, to: Date): Observable<Protocol[]> {
        const fromDate = moment.utc([from.getFullYear(), from.getMonth(), from.getDate(), from.getHours(), from.getMinutes(), from.getSeconds()]);
        const toDate = moment.utc([to.getFullYear(), to.getMonth(), to.getDate(), to.getHours(), to.getMinutes(), to.getSeconds()]);

        return this.getLastProtocols('connection', fromDate, toDate);
    }

    getLastLocation(): Observable<Protocol[]> {
        const fromDate = moment().subtract(1, 'year').utc();
        const toDate = moment().utc();

        return this.getLastProtocols('location', fromDate, toDate);
    }

    getLastConfiguration(): Observable<Protocol[]> {
        const fromDate = moment().subtract(1, 'year').utc();
        const toDate = moment().utc();

        return this.getLastProtocols('/recipe', fromDate, toDate);
    }

    getRecipeProtocols(from: Date, to: Date, limit: number): Observable<Protocol[]> {
        const fromDate = moment.utc([from.getFullYear(), from.getMonth(), from.getDate(), from.getHours(), from.getMinutes(), from.getSeconds()]);
        const toDate = moment.utc([to.getFullYear(), to.getMonth(), to.getDate(), to.getHours(), to.getMinutes(), to.getSeconds()]);

        return this.getProtocols('/recipes', fromDate, toDate, limit);
    }

    getLastRecipeProtocols(from: Date, to: Date): Observable<Protocol[]> {
        const fromDate = moment.utc([from.getFullYear(), from.getMonth(), from.getDate(), from.getHours(), from.getMinutes(), from.getSeconds()]);
        const toDate = moment.utc([to.getFullYear(), to.getMonth(), to.getDate(), to.getHours(), to.getMinutes(), to.getSeconds()]);

        return this.getLastProtocols('/recipes', fromDate, toDate);
    }

}
