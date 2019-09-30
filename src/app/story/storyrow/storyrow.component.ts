import { Component, AfterViewInit, Input, Host, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { faCheck, faCircle, faExclamation, faTimes, faQuestion, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

import { StoryComponent } from '../story.component';
import { GreenwaveService } from '../../services/greenwave.service';
import { GatingStatus, GreenwaveDecision } from '../../models/greenwave.type';


@Component({
  selector: 'app-storyrow',
  templateUrl: './storyrow.component.html',
  styleUrls: ['./storyrow.component.css'],
  // Add an animation so that the gating status badges ease (fade) in and out
  animations: [
    trigger('easeInOut', [
      transition(':enter', [
        style({opacity: 0}),
        animate('0.5s ease-in-out', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('0.5s ease-in-out', style({opacity: 0}))
      ])
    ])
  ]
})
export class StoryRowComponent implements OnChanges, AfterViewInit {
  @Input() node: any;
  @Input() backwardSiblings: number;
  @Input() forwardSiblings: number;
  @Input() active: boolean;
  @Input() first: boolean;
  @Input() last: boolean;
  @Input() totalProcessingTime: number;
  @Input() totalWaitTime: number;
  @Input() totalLeadTime: number;
  @Input() waitTime: number;
  iconClasses: any;
  backwardSiblingsRouterLink: string;
  forwardSiblingsRouterLink: string;
  backwardSiblingsRouterParams: any;
  forwardSiblingsRouterParams: any;
  story: StoryComponent;
  gatingStatus: GatingStatus;
  gatingBadgeLink: Array<string>;

  // Font Awesome icons
  faCircle = faCircle;

  constructor(@Host() story: StoryComponent, private greenwave: GreenwaveService,
              private notification: ToastrService) {
    this.story = story;
    this.gatingStatus = {
      icon: null,
      iconClass: null,
      loading: false,
      statusName: null,
      summary: null,
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    let nodeChanged = false;
    for (const propName of Object.keys(changes)) {
      if (propName === 'node') {
        // Only call this method if the node changes since this is an expensive method call
        nodeChanged = true;
      }
    }

    // If the node is the same, then don't rerun these operations
    if (nodeChanged === false) {
      return;
    }

    this.setGatingStatus();

    this.iconClasses = this.getIconClasses();
    // If there are siblings in either direction, then the siblings links should get defined
    if (this.backwardSiblings) {
      [this.backwardSiblingsRouterLink, this.backwardSiblingsRouterParams] =
        this.story.getSiblingsRouterLink(this.node, true);
    }

    if (this.forwardSiblings) {
      [this.forwardSiblingsRouterLink, this.forwardSiblingsRouterParams] =
        this.story.getSiblingsRouterLink(this.node, false);
    }
  }

  ngAfterViewInit() {
    if (this.last) {
      // If it's the last row in the story, then call the connectStory method on
      // the parent component to draw the lines
      this.story.connectStory();
    }
  }

  getIconClasses(): any {
    const classes = {
      'fa': true,
      'fa-th': true
    };

    switch (this.node.resource_type) {
      case('BugzillaBug'):
        classes['fa-bug'] = true;
        break;
      case('DistGitCommit'):
        classes['estuary-icon-commit'] = true;
        break;
      case('KojiBuild'):
      case('ContainerKojiBuild'):
        classes['pficon-build'] = true;
        break;
      case('ModuleKojiBuild'):
        classes['estuary-icon-module'] = true;
        break;
      case('Advisory'):
      case('ContainerAdvisory'):
        classes['pficon-security'] = true;
        break;
      case('FreshmakerEvent'):
        classes['estuary-icon-freshmaker'] = true;
        break;
      default:
        classes['fa-cube'] = true;
    }

    return classes;
  }

  getNodeUid(): string {
    switch (this.node.resource_type) {
      case('DistGitCommit'):
        return this.node.hash;
      default:
        return this.node.id;
    }
  }

  setGatingStatus() {
    this.gatingBadgeLink = null;
    // Set the gating status to loading so a spinner is shown while the Greenwave API is called
    this.gatingStatus = {
      icon: faSpinner,
      iconClass: 'text-info',
      loading: true,
      statusName: null,
      summary: null,
    };

    const subjectIdentifier = this.greenwave.getSubjectIdentifier(this.node);
    this.greenwave.getArtifactDecision(this.node, subjectIdentifier)
      .subscribe(
        (decision: GreenwaveDecision) => {
          const statusName = this.greenwave.getStatusName(decision);
          if (decision.results.length) {
            this.gatingBadgeLink = ['/test-results', this.node.resource_type.toLowerCase(), subjectIdentifier];
          }

          let icon;
          let iconClass;
          switch (statusName) {
            case('Passed'):
              icon = faCheck;
              iconClass = 'text-success';
              break;
            case('Warning'):
              icon = faExclamation;
              iconClass = 'text-warning';
              break;
            case('Failed'):
              icon = faTimes;
              iconClass = 'text-danger';
              break;
            default:
              icon = faQuestion;
              iconClass = 'text-info';
          }

          this.gatingStatus = {
            icon: icon,
            iconClass: iconClass,
            loading: false,
            statusName,
            summary: decision.summary,
          };
        },
        error => {
          if (this.greenwave.shouldIgnoreError(error)) {
            this.gatingStatus.loading = false;
          } else {
            this.notification.error(`Getting the gating decision for "${this.node.display_name}" failed`);
          }
        },
        () => {
          this.gatingStatus.loading = false;
        }
      );
  }
}
