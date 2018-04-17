import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class ClientService {

  constructor(private http: HttpClient) { }

    getClient(id: string): Observable<Object>{


        const url = '/api/clients/' + id;
        return this.http.get(url);
    }


}
