import { NO_ERRORS_SCHEMA } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import { of } from 'rxjs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { AlertComponent } from './alert/alert.component';
import { NodeTypeDisplayPipe, NodeTypePluralPipe, NodeExternalUrlPipe, TruncatePipe,
         NodeDisplayNamePipe } from './pipes/nodedisplay';
import { PropertyDisplayPipe } from './pipes/propertydisplay';
import { StoryComponent } from './story/story.component';
import { StoryRowComponent } from './story/storyrow/storyrow.component';
import { StorysidebarComponent } from './story/storysidebar/storysidebar.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SiblingsComponent } from './story/siblings/siblings.component';
import { ArtifactRelationshipComponent } from './story/artifact-relationship/artifact-relationship.component';
import { TestResultsComponent } from './story/test-results/test-results.component';
import { environment } from '../environments/environment';


class MockOAuthService {
  validToken: boolean;
  events = of([]);

  setupAutomaticSilentRefresh = jasmine.createSpy('setupAutomaticSilentRefresh');
  configure = jasmine.createSpy('configure');
  loadDiscoveryDocumentAndTryLogin = jasmine.createSpy('loadDiscoveryDocumentAndTryLogin').and.returnValue(Promise.resolve({}));
  logOut = jasmine.createSpy('logOut');

  hasValidAccessToken(): boolean {
    return this.validToken;
  }
}


describe('AppComponent', () => {
  let authService: MockOAuthService;

  beforeEach(async(() => {
    environment.enableAuth = true;
    authService = new MockOAuthService();
    authService.validToken = true;

    TestBed.configureTestingModule({
      declarations: [
        AlertComponent,
        AppComponent,
        ArtifactRelationshipComponent,
        NavbarComponent,
        NodeExternalUrlPipe,
        NodeTypeDisplayPipe,
        NodeTypePluralPipe,
        PropertyDisplayPipe,
        SearchComponent,
        SiblingsComponent,
        SpinnerComponent,
        StoryComponent,
        StoryRowComponent,
        StorysidebarComponent,
        TruncatePipe,
        NodeDisplayNamePipe,
        TestResultsComponent,
      ],
      imports: [
        AppRoutingModule,
        BrowserModule,
        OAuthModule.forRoot()
      ],
      providers: [
        {provide: APP_BASE_HREF, useValue: ''},
        {provide: OAuthService, useValue: authService}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  afterEach(() => {
    environment.enableAuth = false;
  });

  it('should setup auto silent refresh if the access token is valid', fakeAsync(() => {
    TestBed.createComponent(AppComponent);
    tick();
    expect(authService.configure).toHaveBeenCalledTimes(1);
    expect(authService.setupAutomaticSilentRefresh).toHaveBeenCalledTimes(1);
    expect(authService.loadDiscoveryDocumentAndTryLogin).toHaveBeenCalledTimes(1);
  }));

  it('should not setup auto silent refresh if the access token is invalid', fakeAsync(() => {
    authService.validToken = false;
    TestBed.createComponent(AppComponent);
    tick();
    expect(authService.configure).toHaveBeenCalledTimes(1);
    expect(authService.loadDiscoveryDocumentAndTryLogin).toHaveBeenCalledTimes(1);
    expect(authService.setupAutomaticSilentRefresh).not.toHaveBeenCalled();
  }));

  it('should not login the user if auth is disabled', fakeAsync(() => {
    authService.validToken = false;
    environment.enableAuth = false;
    TestBed.createComponent(AppComponent);
    tick();
    expect(authService.configure).not.toHaveBeenCalled();
  }));
});
