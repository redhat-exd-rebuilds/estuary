import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule,  } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { StoryComponent } from './story/story.component';
import { StoryRowComponent, PlumbConnectDirective } from './story/storyrow/storyrow.component';
import { StorysidebarComponent } from './story/storysidebar/storysidebar.component';
import { KeyValuePairsPipe } from './pipes/keyvaluepairs';
import { PropertyDisplayPipe } from './pipes/propertydisplay';
import { NodeUidDisplayPipe } from './pipes/nodedisplay';


@NgModule({
  declarations: [
    AppComponent,
    StoryComponent,
    StoryRowComponent,
    StorysidebarComponent,
    PlumbConnectDirective,
    KeyValuePairsPipe,
    PropertyDisplayPipe,
    NodeUidDisplayPipe
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
