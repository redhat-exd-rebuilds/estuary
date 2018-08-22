import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoryComponent } from './story/story.component';
import { SearchComponent } from './search/search.component';
import { SiblingsComponent } from './story/siblings/siblings.component';
import { ArtifactRelationshipComponent } from './story/artifact-relationship/artifact-relationship.component';


const routes: Routes = [
  {
    path: '',
    component: SearchComponent
  },
  {
    path: ':resource/:uid',
    component: StoryComponent
  },
  {
    path: 'siblings/:resource/:uid',
    component: SiblingsComponent
  },
  {
    path: 'relationship/:resource/:uid/:relationship',
    component: ArtifactRelationshipComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
