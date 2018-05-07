import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';


@Injectable({providedIn: 'root'})
export class SearchService {

  readonly apiUrl: String = environment.api;

  constructor(private http: HttpClient) { }

  getAvailableResources(): Observable<any> {
    // TODO: Cache this
    const url = `${this.apiUrl}story`;
    return this.http.get(url);
  }
}
