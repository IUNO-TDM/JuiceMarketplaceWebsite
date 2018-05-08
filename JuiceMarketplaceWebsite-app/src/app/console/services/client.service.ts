import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";
import {Client} from "../models/Client";

@Injectable()
export class ClientService {

  constructor(private http: HttpClient) { }

    getClient(id: string): Observable<Client>{


        const url = '/api/clients/' + id;
        return this.http.get<Client>(url);
    }


}
