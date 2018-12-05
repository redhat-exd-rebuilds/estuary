import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

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
  errorMsg: string;

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

    this.greenwaveService.getArtifactDecision(resource, subjectIdentifier).subscribe(
      decision => {
        this.greenwaveDecision = decision;
        this.loading = false;
      },
      errorResponse => {
        this.errorMsg = errorResponse.error.message;
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }

  onTableError(errorMsg: string): void {
    this.errorMsg = errorMsg;
  }
}
