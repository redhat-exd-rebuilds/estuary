import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoryComponent } from './story/story.component';
import { SearchComponent } from './search/search.component';
import { SiblingsComponent } from './story/siblings/siblings.component';
import { ArtifactRelationshipComponent } from './story/artifact-relationship/artifact-relationship.component';
import { AuthGuardService } from './services/auth-guard.service';


const routes: Routes = [
  {
    path: '',
    component: SearchComponent
  },
  {
    path: ':resource/:uid',
    component: StoryComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'siblings/:resource/:uid',
    component: SiblingsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'relationship/:resource/:uid/:relationship',
    component: ArtifactRelationshipComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
