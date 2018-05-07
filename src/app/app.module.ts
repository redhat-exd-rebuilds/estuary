import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule,  } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { StoryComponent } from './story/story.component';
import { StoryRowComponent, PlumbConnectDirective } from './story/storyrow/storyrow.component';
import { StorysidebarComponent } from './story/storysidebar/storysidebar.component';
import { KeyValuePairsPipe, KeysPipe } from './pipes/keyvaluepairs';
import { PropertyDisplayPipe } from './pipes/propertydisplay';
import { NodeUidDisplayPipe, NodeTypeDisplayPipe } from './pipes/nodedisplay';
import { SearchComponent } from './search/search.component';


@NgModule({
  declarations: [
    AppComponent,
    StoryComponent,
    StoryRowComponent,
    StorysidebarComponent,
    PlumbConnectDirective,
    KeyValuePairsPipe,
    PropertyDisplayPipe,
    NodeUidDisplayPipe,
    SearchComponent,
    KeysPipe,
    NodeTypeDisplayPipe
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
