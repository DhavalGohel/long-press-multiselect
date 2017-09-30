import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { AppConfig } from '../AppConfig';

@Injectable()
export class DashboardService {
  public token: string = null;
  constructor(
    public http: Http,
    public appConfig: AppConfig
  ) {
  }

  getImageData(token?: string, page? : number ,options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise((resolve, reject) => {
      this.http.get("https://randomuser.me/api/?page="+page+"&results=10", options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          try {
            resolve(err.json());
          } catch (e) {
            reject(err)
          }
        });
    });
  }
}
