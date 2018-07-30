import { Component, AfterViewInit, Input, Host, OnChanges } from '@angular/core';

import { StoryComponent } from '../story.component';


@Component({
  selector: 'app-storyrow',
  templateUrl: './storyrow.component.html',
  styleUrls: ['./storyrow.component.css']
})
export class StoryRowComponent implements OnChanges, AfterViewInit {
  @Input() node: any;
  @Input() backwardSiblings: number;
  @Input() forwardSiblings: number;
  @Input() active: boolean;
  @Input() last: boolean;
  iconClasses: any;
  backwardSiblingsRouterLink: string;
  forwardSiblingsRouterLink: string;
  backwardSiblingsRouterParams: any;
  forwardSiblingsRouterParams: any;
  story: StoryComponent;

  constructor(@Host() story: StoryComponent) {
    this.story = story;
  }

  ngOnChanges() {
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
}
