import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import {TechnologyData} from "../models/technologydata";

@Injectable()
export class TechnologydataService {

    private _technologyData: BehaviorSubject<TechnologyData[]> = new BehaviorSubject([]);
    public readonly technologyData: Observable<TechnologyData[]> = this._technologyData.asObservable();

    private technologyDataUrl = '/api/technologydata';
  constructor(private http: HttpClient) {
    this.updateTechnologyData();
  }

    updateTechnologyData() {
        this.http.get<TechnologyData[]>(this.technologyDataUrl).subscribe(td => {
            this._technologyData.next(td);
        }, error => {
            this.handleError(error);
        });
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

}
