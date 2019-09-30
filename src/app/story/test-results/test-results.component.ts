import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { GreenwaveService } from '../../services/greenwave.service';
import { GreenwaveDecision } from '../../models/greenwave.type';
import { StoryService } from '../../services/story.service';


@Component({
  selector: 'app-test-results',
  templateUrl: './test-results.component.html',
})
export class TestResultsComponent implements OnInit {

  loading: boolean;
  greenwaveDecision: GreenwaveDecision;
  artifact: any;
  resource: string;
  subjectIdentifier: string;

  constructor(private greenwaveService: GreenwaveService, private storyService: StoryService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: ParamMap) => {
      this.loading = true;
      this.subjectIdentifier = params['subjectIdentifier'];
      this.resource = params['resource'];
      this.artifact = null;

      // If the artifact is a container build, then we need the whole artifact to determine the
      // correct Greenwave decision context.
      if (['containerkojibuild', 'containerbuild'].includes(params['resource'].toLowerCase())) {
        this.storyService.getArtifact(this.resource, this.subjectIdentifier).subscribe(artifact => {
          this.artifact = artifact;
          this.getArtifactDecision();
        });
      } else {
        this.getArtifactDecision();
      }
    });
  }

  getArtifactDecision() {
    this.greenwaveDecision = null;
    this.greenwaveService.getArtifactDecision(this.artifact || this.resource, this.subjectIdentifier)
      .pipe(finalize(() => this.loading = false))
      .subscribe(decision => { this.greenwaveDecision = decision; });
  }
}
