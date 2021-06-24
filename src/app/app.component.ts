import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { filter as filterObservable } from 'rxjs/operators';

import { environment } from '../environments/environment';


@Component({
  selector: 'app-root',
  template: `
    <router-outlet (activate)="onActivate()"></router-outlet>
  `,
})
export class AppComponent {
  constructor (private auth: OAuthService, private router: Router) {
    if (environment.enableAuth === true) {
      this.configureAuth();
    }
  }

  private configureAuth(): void {
    this.auth.configure({
      issuer: environment.oidcIssuer,
      clientId: environment.oidcClientId,
      redirectUri: window.location.origin,
      logoutUrl: window.location.origin,
      scope: 'openid',
      // Logout automatically if the IDP invalidates the session
      sessionChecksEnabled: true,
      // Fixes an issue with redirects in Firefox
      clearHashAfterLogin: false
    });
    this.auth.tokenValidationHandler = new JwksValidationHandler();

    this.auth.events.pipe(filterObservable(e => e.type === 'token_received')).subscribe(() => {
      const state = this.auth.state;
      if (state) {
        // Only redirect if the state is set. Clear immediately to prevent
        // redirects after silent refreshes.
        this.auth.state = null;
        // The state (URL) is stored as a base64 string in case there are query
        // parameters in the URL the user requested, so decode it first before
        // giving it to the router.
        this.router.navigateByUrl(atob(state));
      }
    });

    // Load the discovery document that tells the library where all the OAuth2
    // endpoints are, supported scopes, etc. Then attempt to login using the
    // information in the route URL (after the OpenID Connect provider redirects
    // the user back to the app). The promise is resolved regardless of the user
    // state.
    this.auth.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.auth.hasValidAccessToken()) {
        // Once we have a valid token, setup automatic token refreshing so the
        // user doesn't have to login again manually after the token expires
        this.auth.setupAutomaticSilentRefresh();
      }
    });
  }

  onActivate() {
    // Smoothly scroll up the page without the use of animations
    const scrollToTop = window.setInterval(() => {
      const pos = window.pageYOffset;
      if (pos > 0) {
          window.scrollTo(0, pos - 20);
      } else {
          window.clearInterval(scrollToTop);
      }
    }, 15);
  }
}
