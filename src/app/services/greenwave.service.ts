import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, EMPTY as emptyObservable } from 'rxjs';

import { GreenwaveDecision } from '../models/greenwave.type';
import { environment } from '../../environments/environment';


@Injectable({providedIn: 'root'})
export class GreenwaveService {

  readonly greenwaveURL: string = environment.greenwaveAPI;
  readonly pVParseError = 'The product version could not be determined from the NVR';

  constructor(private http: HttpClient) { }

  getProductVersionFromNVR(nvr): string {
    let distTag = nvr.slice(nvr.lastIndexOf('.') + 1);
    // If the NVR is of a modular RPM, then strip the "module+" part so the calculation
    // below is the same
    if (distTag.startsWith('module+')) {
      distTag = nvr.slice(7);
    }
    // If the dist tag calculation resulted in being equal to the same value as
    // nvr (doesn't contain a period) or an empty string (ends on a period),
    // then we know the distTag can't be derived
    if (distTag === nvr || distTag === '') {
      throw new Error(this.pVParseError);
    }

    // If the dist tag doesn't start with "el", then this isn't for RHEL and it's not supported
    if (!distTag.startsWith('el')) {
      throw new Error(this.pVParseError);
    }

    let elVersion = '';
    // Start after the "el" part of the string and parse the version
    for (let i = 2; i < distTag.length; i++) {
      if (isNaN(distTag[i])) {
        break;
      } else {
        elVersion += distTag[i];
      }
    }

    // If a version couldn't be parsed from the dist tag, then it's not supported
    if (elVersion === '') {
      throw new Error(this.pVParseError);
    }

    return `rhel-${elVersion}`;
  }

  getDecision(subjectIdentifier: string, decisionContext: string, productVersion: string,
              subjectType: string, verbose = true): Observable<GreenwaveDecision> {
    const body = {
      subject_identifier: subjectIdentifier,
      decision_context: decisionContext,
      product_version: productVersion,
      subject_type: subjectType,
      verbose
    };
    const options = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    return this.http.post<GreenwaveDecision>(`${this.greenwaveURL}decision`, body, options);
  }

  getArtifactDecision(artifact: any, verbose = true): Observable<any> {
    // For builds, this is an NVR
    const subjectIdentifier = artifact.display_name;
    let decisionContext: string;
    let productVersion: string;
    const subjectType = 'koji_build';

    switch (artifact.resource_type) {
      case('ContainerKojiBuild'):
        decisionContext = 'cvp_default';
        productVersion = 'cvp';
        break;
      case('KojiBuild'):
        decisionContext = 'osci_compose_gate';
        try {
          productVersion = this.getProductVersionFromNVR(subjectIdentifier);
        } catch (error) {
          // If the product version can't be determined, just return an empty observable
          // since the caller expects an observable to be returned
          return emptyObservable;
        }
        break;
      default:
        return emptyObservable;
    }

    return this.getDecision(subjectIdentifier, decisionContext, productVersion, subjectType, verbose);
  }

  getStatusName(decision: GreenwaveDecision): string {
      if (decision.policies_satisfied) {
        if (decision.waivers.some(w => w.waived)) {
          return 'Warning';
        } else {
          return 'Passed';
        }
      }

      return 'Failed';
  }

  shouldIgnoreError(error): boolean {
    // If Greenwave returned a 404 error then it just means there's no applicable policy
    // for this artifact
    return error instanceof HttpErrorResponse && error.status === 404;
  }
}
