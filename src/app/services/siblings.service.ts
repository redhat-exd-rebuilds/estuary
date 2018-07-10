import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';


@Injectable({providedIn: 'root'})
export class SiblingsService {

  readonly apiUrl: string = environment.api;

  constructor(private http: HttpClient) { }

  getSiblings(resource: string, uid: string, reverse = false): Observable<any> {
    return this.http.get(`${this.apiUrl}siblings/${resource}/${uid}?reverse=${reverse}`);
  }
}
