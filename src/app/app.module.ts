import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule,  } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NotificationModule } from 'patternfly-ng/notification';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { StoryComponent } from './story/story.component';
import { StoryRowComponent, PlumbConnectDirective } from './story/storyrow/storyrow.component';
import { StorysidebarComponent } from './story/storysidebar/storysidebar.component';
import { KeysPipe } from './pipes/keyvaluepairs';
import { PropertyDisplayPipe } from './pipes/propertydisplay';
import { NodeUidDisplayPipe, NodeTypeDisplayPipe, NodeTypePluralPipe, NodeFilterPropertiesPipe,
         NodeExternalUrlPipe } from './pipes/nodedisplay';
import { SearchComponent } from './search/search.component';


@NgModule({
  declarations: [
    AppComponent,
    StoryComponent,
    StoryRowComponent,
    StorysidebarComponent,
    PlumbConnectDirective,
    PropertyDisplayPipe,
    NodeUidDisplayPipe,
    SearchComponent,
    KeysPipe,
    NodeTypeDisplayPipe,
    NodeFilterPropertiesPipe,
    NodeTypePluralPipe,
    NodeExternalUrlPipe
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NotificationModule,
    TooltipModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
