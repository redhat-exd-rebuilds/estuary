import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { GreenwaveService } from '../../services/greenwave.service';
import { GreenwaveDecision } from '../../models/greenwave.type';


@Component({
  selector: 'app-test-results',
  templateUrl: './test-results.component.html',
})
export class TestResultsComponent implements OnInit {

  loading: boolean;
  greenwaveDecision: GreenwaveDecision;
  subjectIdentifier: string;

  constructor(private greenwaveService: GreenwaveService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: ParamMap) => {
      this.subjectIdentifier = params['subjectIdentifier'];
      this.getArtifactDecision(params['resource'], this.subjectIdentifier);
    });
  }

  getArtifactDecision(resource: string, subjectIdentifier: string) {
    this.loading = true;
    this.greenwaveDecision = null;

    this.greenwaveService.getArtifactDecision(resource, subjectIdentifier).pipe(finalize(() => this.loading = false)).subscribe(
      decision => {
        this.greenwaveDecision = decision;
      }
    );
  }
}
