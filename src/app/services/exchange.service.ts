import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient} from '@angular/common/http'
import { catchError, Observable, of } from 'rxjs';
import { Exchange } from '../models/exchange';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {
  baseURL = environment.apiURL;
  constructor(private http : HttpClient) { }

  onCount(value:string): Observable<Exchange>{
    const url = this.baseURL + value;
    return this.http.get<Exchange>(url);
  }

  /*public getExchangeObj( value:string): Observable<Exchange[]>{
    const url = this.baseURL + value;
    return this.onCount(url).pipe(
      map(json => {
        //arreglo para guardar los objetos transformados
        let ex: Exchange[] = [];
        //iterar las keys del objeto
        Object.keys(json).forEach(k => {
          //insertar el nuevo objeto
          ex.push({
            money:k,
            value: json[k]
          });
        });
        return ex;
      })
    );
  }*/
  private handleError(operation = 'operation', result?:Exchange){
    return (error: any): Observable<Exchange> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);

      return of(result as Exchange);
    };
  }
  private log(message: string){
    console.log(message);
  }
}

