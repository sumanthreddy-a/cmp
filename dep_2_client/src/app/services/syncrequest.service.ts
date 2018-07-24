import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpModule } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Url } from '../services/config';

@Injectable()
export class SyncrequestService {

  url = new Url().getGlobalUrl();
  constructor(private http: HttpClient) { }

  /**
   * Syncs request list
   * @returns  
   */
   syncRequestList() {
    return this.http.get(this.url + 'newrequest')
      .map((res: Response) => {
        return res;
      }).catch((error) => {
        return error;
      });
  }

  /**
   * Syncs request
   * @param request 
   * @returns  
   */
   syncRequest(request) {
    return this.http.post(this.url + 'newrequest', request)
      .map((res: Response) => {
        return res;
      }).catch((error) => {
        return error;
      });
  }

  /**
   * Approved syncrequest service
   * @param request 
   * @returns  
   */
   approved(request) {
    return this.http.put(this.url + 'newrequest/'+request.id, request)
      .map((res: Response) => {
        return res;
      }).catch((error) => {
        return error;
      });
  }
   reject(request) {
    return this.http.put(this.url + 'newrequest/'+request.id, request)
      .map((res: Response) => {
        return res;
      }).catch((error) => {
        return error;
      });
  }



}
