import { TestBed } from '@angular/core/testing';
import { AuthGuardService } from './auth-guard.service';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

import { environment } from '../../environments/environment';


class MockOAuthService {
  validToken = false;

  initImplicitFlow = jasmine.createSpy('initImplicitFlow');
  hasValidAccessToken(): boolean {
    return this.validToken;
  }
}


describe('AuthGuardService testing', () => {
  let authGuardService: AuthGuardService;
  const authService = new MockOAuthService();

  beforeEach(() => {
    environment.enableAuth = true;
    authService.validToken = true;
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AuthGuardService,
        {provide: OAuthService, useValue: authService}
      ]
    });

    authGuardService = TestBed.get(AuthGuardService);
  });

  afterEach(() => {
    environment.enableAuth = false;
  });

  it('allows a user with a valid token through', () => {
    const state = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);
    expect(authGuardService.canActivate(new ActivatedRouteSnapshot(), state)).toBe(true);
  });

  it('forces a user to login without a valid token', () => {
    authService.validToken = false;
    const stateUrl = 'https://some.domain.local/page123';
    // A small hack to create a Jasmine spy object with the url property to match
    // the RouterStateSnapshot class
    const mockSnapshot = {
      ...jasmine.createSpyObj('RouterStateSnapshot', ['toString']),
      url: stateUrl,
    } as jasmine.SpyObj<RouterStateSnapshot>;
    expect(authGuardService.canActivate(new ActivatedRouteSnapshot(), mockSnapshot)).toBe(false);
    expect(authService.initImplicitFlow).toHaveBeenCalledTimes(1);
    expect(authService.initImplicitFlow).toHaveBeenCalledWith(btoa(stateUrl));
  });
});
