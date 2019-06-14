import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';


@Injectable({providedIn: 'root'})
export class StoryService {

  readonly apiUrl: string = environment.api;

  constructor(private http: HttpClient) { }

  getStory(resource: string, uid: string): Observable<any> {
    const fallback = [];
    let targetResource = resource.toLowerCase();
    if (targetResource === 'advisory' || targetResource === 'kojibuild') {
      // Try the container labels first and fallback to the general labels
      if (targetResource === 'kojibuild') {
        fallback.push(`module${targetResource}`);
      }
      fallback.push(targetResource);
      targetResource = `container${targetResource}`;
    }

    const userInput = encodeURIComponent(uid);
    let url = `${this.apiUrl}story/${targetResource}/${userInput}`;
    if (fallback.length) {
      url += `?fallback=${fallback[0]}`;
      for (let i = 1; i < fallback.length; i++) {
        url += `&fallback=${fallback[i]}`;
      }
    }
    return this.http.get(url);
  }
}
