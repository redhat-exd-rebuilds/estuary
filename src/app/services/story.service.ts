import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';


@Injectable()
export class StoryService {

  readonly apiUrl: string = environment.api;

  constructor(private http: HttpClient) { }

  getStory(resource: string, uid: string): Observable<any> {
    const url = `${this.apiUrl}story/${resource}/${uid}`;
    return this.http.get(url);
  }
}
