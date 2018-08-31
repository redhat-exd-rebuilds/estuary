import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private auth: OAuthService) {}


  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // The user may proceed if auth is disabled or the user has a valid access token
    if (environment.enableAuth === false || this.auth.hasValidAccessToken()) {
      return true;
    }

    // Initiate the authentication flow if auth is enabled and the user doesn't have
    // a valid access token. This causes the user to be redirected to the OpenID
    // Connect provider to login. Once the login is complete, the user is redirected
    // to the requested page that required auth.
    this.auth.initImplicitFlow(btoa(state.url));

    return false;
  }
}
