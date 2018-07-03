import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule,  } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NotificationModule } from 'patternfly-ng/notification';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { StoryComponent } from './story/story.component';
import { StoryRowComponent } from './story/storyrow/storyrow.component';
import { StorysidebarComponent } from './story/storysidebar/storysidebar.component';
import { PropertyDisplayPipe, PropertyValueDisplayPipe } from './pipes/propertydisplay';
import { NodeUidDisplayPipe, NodeTypeDisplayPipe, NodeTypePluralPipe, NodeExternalUrlPipe,
         TruncatePipe } from './pipes/nodedisplay';
import { SearchComponent } from './search/search.component';
import { AlertComponent } from './alert/alert.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SiblingsComponent } from './story/siblings/siblings.component';


@NgModule({
  declarations: [
    AppComponent,
    StoryComponent,
    StoryRowComponent,
    StorysidebarComponent,
    PropertyDisplayPipe,
    NodeUidDisplayPipe,
    SearchComponent,
    NodeTypeDisplayPipe,
    NodeTypePluralPipe,
    NodeExternalUrlPipe,
    AlertComponent,
    SpinnerComponent,
    TruncatePipe,
    NavbarComponent,
    SiblingsComponent,
    PropertyValueDisplayPipe
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    NotificationModule,
    TooltipModule.forRoot()
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
