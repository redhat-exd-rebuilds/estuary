import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';


@Injectable({providedIn: 'root'})
export class StoryService {

  readonly apiUrl: string = environment.api;

  constructor(private http: HttpClient) { }

  getStory(resource: string, uid: string): Observable<any> {
    let fallback = null;
    let targetResource = resource.toLowerCase();
    if (targetResource === 'advisory' || targetResource === 'kojibuild') {
      // Try the container labels first and fallback to the general labels
      fallback = targetResource;
      targetResource = `container${targetResource}`;
    }
    let url = `${this.apiUrl}story/${targetResource}/${uid}`;
    if (fallback) {
      url += `?fallback=${fallback}`;
    }
    return this.http.get(url);
  }
}
