import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule,  } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { StoryComponent } from './story/story.component';
import { StoryService } from './services/story.service';
import { StoryRowComponent, PlumbConnectDirective } from './story/storyrow/storyrow.component';


@NgModule({
  declarations: [
    AppComponent,
    StoryComponent,
    StoryRowComponent,
    PlumbConnectDirective
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [StoryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
