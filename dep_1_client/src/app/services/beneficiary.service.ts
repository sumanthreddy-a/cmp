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
export class BeneficiaryService {
  url = new Url().getGlobalUrl();
  constructor(private http: HttpClient) { }
  public beneficiary() {
    return this.http.get(this.url + 'beneficiary')
      .map((res: Response) => {
        return res;
      }).catch((error) => {
        return error;
      });
  }
  addBeneficiary(beneficiary) {
    return this.http.post(this.url + 'beneficiary', beneficiary)
      .map((res: Response) => {
        return res;
      }).catch((error) => {
        return error;
      });
  }

}
