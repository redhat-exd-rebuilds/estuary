import { Component, OnDestroy, TemplateRef } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { SiblingsService } from '../../services/siblings.service';


@Component({
  selector: 'app-siblings',
  templateUrl: './siblings.component.html'
})
export class SiblingsComponent implements OnDestroy {

  loading: boolean;
  title: string;
  siblings: Array<any>;
  errorMsg: string;
  private unsubscribe: Subject<any> = new Subject();

  constructor(private siblingsService: SiblingsService, private router: Router,
              private route: ActivatedRoute) {
    this.loading = true;
    this.router.events.pipe(takeUntil(this.unsubscribe),
                            filter((event: Event) => event instanceof NavigationEnd)).subscribe(() => {
      // Reset the values on every route change
      this.siblings = [];
      this.title = null;

      let backwardRel: boolean;
      if ('backward_rel' in this.route.snapshot.queryParams) {
        backwardRel = this.route.snapshot.queryParams['backward_rel'];
      } else {
        backwardRel = false;
      }

      this.getSiblings(this.route.snapshot.params['resource'], this.route.snapshot.params['uid'], backwardRel);
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getSiblings(resource: string, uid: string, backwardRel: boolean) {
    this.loading = true;
    this.siblingsService.getSiblings(resource, uid, backwardRel).subscribe(
      siblings => {
        this.title = siblings.meta.description;
        if (siblings.data.length) {
          this.siblings = siblings.data;
        } else {
          this.errorMsg = 'There are no siblings associated with this artifact';
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
