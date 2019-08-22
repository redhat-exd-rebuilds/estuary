import { Component, OnDestroy, TemplateRef } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, RouterEvent } from '@angular/router';
import { filter, takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { SiblingsService } from '../../services/siblings.service';


@Component({
  selector: 'app-siblings',
  templateUrl: './siblings.component.html'
})
export class SiblingsComponent implements OnDestroy {

  loading: boolean;
  title: string;
  siblings: Array<any>;
  private unsubscribe: Subject<any> = new Subject();

  constructor(private siblingsService: SiblingsService, private router: Router,
              private route: ActivatedRoute, private notification: ToastrService) {
    this.loading = true;
    this.router.events.pipe(takeUntil(this.unsubscribe),
                            filter((event: RouterEvent) => event instanceof NavigationEnd)).subscribe(() => {
      // Reset the values on every route change
      this.siblings = [];
      this.title = null;

      const story_type: string = this.route.snapshot.queryParams['story_type'];

      let backwardRel: boolean;
      if ('backward_rel' in this.route.snapshot.queryParams) {
        backwardRel = this.route.snapshot.queryParams['backward_rel'];
      } else {
        backwardRel = false;
      }

      this.getSiblings(this.route.snapshot.params['resource'], this.route.snapshot.params['uid'], backwardRel, story_type);
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getSiblings(resource: string, uid: string, backwardRel: boolean, story_type: string) {
    this.loading = true;
    this.siblingsService.getSiblings(resource, uid, backwardRel, story_type).pipe(finalize(() => this.loading = false)).subscribe(
      siblings => {
        this.title = siblings.meta.description;
        if (siblings.data.length) {
          this.siblings = siblings.data;
        } else {
          this.notification.warning('There are no siblings associated with this artifact');
        }
      }
    );
  }
}
