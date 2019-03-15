import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RelationshipService } from '../../services/relationship.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-artifact-relationship',
  templateUrl: './artifact-relationship.component.html',
  styleUrls: ['./artifact-relationship.component.css']
})
export class ArtifactRelationshipComponent  {

  loading: boolean;
  artifacts: Array<any>;
  title: string;

  constructor(private route: ActivatedRoute, private relationshipService: RelationshipService,
              private notification: NotificationService) {
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
          this.notification.display('There are no artifacts tied to this relationship', 'danger');
        }
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }
}
