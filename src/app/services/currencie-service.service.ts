import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs';
import { Currencies } from '../models/currencies';

@Injectable({
  providedIn: 'root'
})
export class CurrencieServiceService {
  baseURL = environment.apiURL;
  constructor(private http : HttpClient) { }

  onCount(value: string): Observable<Currencies>{
    const url = this.baseURL + value;
    return this.http.get<Currencies>(url);
  }

}
