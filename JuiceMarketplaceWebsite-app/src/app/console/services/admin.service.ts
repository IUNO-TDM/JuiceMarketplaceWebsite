import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import * as moment from "moment";

@Injectable()
export class AdminService {

    constructor(private http: HttpClient) {
    }

    getConnectionProtocols(from: Date, to: Date): Observable<Object>{
        const fromDate = moment.utc([from.getFullYear(),from.getMonth(), from.getDate(),from.getHours(), from.getMinutes(), from.getSeconds()]);
        const toDate = moment.utc([to.getFullYear(),to.getMonth(), to.getDate(),to.getHours(), to.getMinutes(), to.getSeconds()]);
        const url = '/api/admin/protocols?eventType=connection&from=' + fromDate.format() + '&to=' + toDate.format();
        return this.http.get(url);
    }

    getLastConnectionProtocols(from: Date, to: Date): Observable<Object>{
        const fromDate = moment.utc([from.getFullYear(),from.getMonth(), from.getDate(),from.getHours(), from.getMinutes(), from.getSeconds()]);
        const toDate = moment.utc([to.getFullYear(),to.getMonth(), to.getDate(),to.getHours(), to.getMinutes(), to.getSeconds()]);
        const url = '/api/admin/protocols/last?eventType=connection&from=' + fromDate.format() + '&to=' + toDate.format();
        return this.http.get(url);
    }

}
