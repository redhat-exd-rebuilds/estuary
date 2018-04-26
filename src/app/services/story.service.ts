import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';


@Injectable()
export class StoryService {

  readonly apiUrl: String = environment.api;

  constructor(private http: HttpClient) { }

  getStory(resource: String, uid: String): Observable<any> {
    const url = `${this.apiUrl}story/${resource}/${uid}`;
    return this.http.get(url);
  }
}
