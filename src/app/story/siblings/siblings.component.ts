import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { SiblingsService } from '../../services/siblings.service';


@Component({
  selector: 'app-siblings',
  templateUrl: './siblings.component.html',
  styleUrls: ['./siblings.component.css']
})
export class SiblingsComponent implements OnDestroy {

  loading: boolean;
  selectedResource: string;
  selectedUid: string;
  selectedDisplayName: string;
  siblings: Array<any>;
  errorMsg: string;
  defaultProperties: Array<string>;
  private unsubscribe: Subject<any> = new Subject();

  constructor(private siblingsService: SiblingsService, private router: Router,
              private route: ActivatedRoute) {
    this.loading = true;
    this.router.events.pipe(takeUntil(this.unsubscribe),
                            filter((event: Event) => event instanceof NavigationEnd)).subscribe(() => {
      // Reset the values on every route change
      this.siblings = null;
      this.defaultProperties = null;

      this.selectedResource = this.route.snapshot.params['resource'];
      this.selectedUid = this.route.snapshot.params['uid'];

      let reverse: boolean;
      if ('reverse' in this.route.snapshot.queryParams) {
        reverse = this.route.snapshot.queryParams['reverse'];
      } else {
        reverse = false;
      }

      if ('displayName' in this.route.snapshot.queryParams) {
        this.selectedDisplayName = this.route.snapshot.queryParams['displayName'];
      } else {
        this.selectedDisplayName = null;
      }

      this.getSiblings(this.selectedResource, this.selectedUid, reverse);
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getSiblings(resource: string, uid: string, reverse: boolean) {
    this.loading = true;
    this.siblingsService.getSiblings(resource, uid, reverse).subscribe(
      siblings => {
        if (siblings.length) {
          this.defaultProperties = this.getDefaultProperties(siblings[0].resource_type);
        }
        this.siblings = siblings;
        this.loading = false;
      },
      errorResponse => {
        this.errorMsg = errorResponse.error.message;
        this.loading = false;
      }
    );
  }

  getDefaultProperties(resource: string) {
    switch (resource.toLowerCase()) {
      case ('bugzillabug'):
        return ['id', 'assignee', 'reporter', 'short_description', 'status'];
      case ('distgitcommit'):
        return ['hash', 'author', 'log_message'];
      case ('kojibuild'):
      case ('containerkojibuild'):
        return ['id', 'name', 'version', 'release', 'owner'];
      case ('containeradvisory'):
      case ('advisory'):
        return ['id', 'advisory_name', 'assigned_to', 'security_impact', 'state', 'synopsis'];
      case ('freshmakerevent'):
        return ['id', 'state_name', 'state_reason', 'triggered_container_builds'];
      default:
        return ['id'];
    }
  }
}
