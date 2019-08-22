import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { StoryComponent } from './story/story.component';
import { StoryRowComponent } from './story/storyrow/storyrow.component';
import { StorysidebarComponent } from './story/storysidebar/storysidebar.component';
import { TotalTimesComponent } from './story/storyrow/totaltimes/totaltimes.component';
import { PropertyDisplayPipe, PropertyValueDisplayPipe } from './pipes/propertydisplay';
import { NodeTypeDisplayPipe, NodeTypePluralPipe, NodeExternalUrlPipe,
         TruncatePipe, NodeDisplayNamePipe } from './pipes/nodedisplay';
import { TimeDisplayPipe } from './pipes/timedisplay';
import { SearchComponent } from './search/search.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RecentsComponent } from './recents/recents.component';
import { SiblingsComponent } from './story/siblings/siblings.component';
import { ArtifactsTableComponent } from './tables/artifacts-table/artifacts-table.component';
import { ArtifactRelationshipComponent } from './story/artifact-relationship/artifact-relationship.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { environment } from '../environments/environment';
import { EstuaryTableComponent } from './tables/table.component';
import { TruncateModalComponent } from './tables/truncate-modal/truncate-modal.component';
import { TestsTableComponent } from './tables/tests-table/tests-table.component';
import { TestResultsComponent } from './story/test-results/test-results.component';
import { HTTPErrorHandler } from './interceptors/http-error-handler';


@NgModule({
  declarations: [
    AppComponent,
    StoryComponent,
    StoryRowComponent,
    StorysidebarComponent,
    TotalTimesComponent,
    PropertyDisplayPipe,
    SearchComponent,
    NodeTypeDisplayPipe,
    NodeTypePluralPipe,
    NodeExternalUrlPipe,
    SpinnerComponent,
    TruncatePipe,
    NavbarComponent,
    RecentsComponent,
    SiblingsComponent,
    PropertyValueDisplayPipe,
    ArtifactsTableComponent,
    ArtifactRelationshipComponent,
    NodeDisplayNamePipe,
    EstuaryTableComponent,
    TruncateModalComponent,
    TestsTableComponent,
    TestResultsComponent,
    TimeDisplayPipe,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    FontAwesomeModule,
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: [environment.api],
        sendAccessToken: true
      }
    }),
    TabsModule.forRoot(),
    ToastrModule.forRoot({
      progressBar: true,
      closeButton: true,
    }),
  ],
  providers: [
    DatePipe,
    // Use localStorage instead of sessionStorage for storing the OpenID
    // Connect tokens
    { provide: OAuthStorage, useValue: localStorage },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HTTPErrorHandler,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
