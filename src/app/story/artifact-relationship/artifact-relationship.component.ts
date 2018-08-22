import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RelationshipService } from '../../services/relationship.service';

@Component({
  selector: 'app-artifact-relationship',
  templateUrl: './artifact-relationship.component.html',
  styleUrls: ['./artifact-relationship.component.css']
})
export class ArtifactRelationshipComponent  {

  loading: boolean;
  artifacts: Array<any>;
  title: string;
  errorMsg: string;

  constructor(private route: ActivatedRoute, private relationshipService: RelationshipService) {
    this.artifacts = [];
    this.route.params.subscribe(params => {
      this.getRelatedArtifacts(params['resource'], params['uid'], params['relationship']);
    });
  }

  getRelatedArtifacts(resource: string, uid: string, relationship: string) {
    this.loading = true;
    this.relationshipService.getRelatedArtifacts(resource, uid, relationship).subscribe(
      artifacts => {
        this.title = artifacts.meta.description[0].toUpperCase() + artifacts.meta.description.slice(1);
        if (artifacts.data.length) {
          this.artifacts = artifacts.data;
        } else {
          this.errorMsg = 'There are no artifacts tied to this relationship';
        }
        this.loading = false;
      },
      errorResponse => {
        this.errorMsg = errorResponse.error.message;
        this.loading = false;
      }
    );
  }

  onTableError(errorMsg: string): void {
    this.errorMsg = errorMsg;
  }
}
