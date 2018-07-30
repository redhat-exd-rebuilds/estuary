import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';


@Injectable({providedIn: 'root'})
export class SiblingsService {

  readonly apiUrl: string = environment.api;

  constructor(private http: HttpClient) { }

  getSiblings(resource: string, uid: string, backwardRel = false): Observable<any> {
    let url = `${this.apiUrl}siblings/${resource}/${uid}`;
    if (backwardRel) {
      url += '?backward_rel=true';
    }
    return this.http.get(url);
  }
}
