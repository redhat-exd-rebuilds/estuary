import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';


@Injectable({providedIn: 'root'})
export class RecentsService {

  readonly apiUrl: string = environment.api;

  constructor(private http: HttpClient) { }

  getRecents(): Observable<any> {
    const url = `${this.apiUrl}recents`;
    return this.http.get(url);
  }
}
