
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoryComponent } from './story/story.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {
    path: '',
    component: SearchComponent
  },
  {
    path: ':resource/:uid',
    component: StoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
