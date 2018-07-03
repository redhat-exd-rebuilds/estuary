import { Component, AfterViewInit, Input, Host, OnInit, OnChanges } from '@angular/core';

import { StoryComponent } from '../story.component';


@Component({
  selector: 'app-storyrow',
  templateUrl: './storyrow.component.html',
  styleUrls: ['./storyrow.component.css']
})
export class StoryRowComponent implements OnChanges, AfterViewInit {
  @Input() node: any;
  @Input() relatedNodes: number;
  @Input() active: boolean;
  @Input() last: boolean;
  siblingsRouterLink: string;
  siblingsRouterParams: any;
  story: StoryComponent;

  constructor(@Host() story: StoryComponent) {
    this.story = story;
  }

  ngOnChanges() {
    if (this.relatedNodes) {
      // If there are related nodes, then the siblings link should get defined
      [this.siblingsRouterLink, this.siblingsRouterParams] = this.story.getSiblingsRouterLink(this.node, this.last);
    }
  }

  ngAfterViewInit() {
    if (this.last) {
      // If it's the last row in the story, then call the connectStory method on
      // the parent component to draw the lines
      this.story.connectStory();
    }
  }

  getNodeIconClass(): string {
    switch (this.node.resource_type) {
      case('BugzillaBug'):
        return 'fa-bug';
      case('DistGitCommit'):
        return 'estuary-icon-commit';
      case('KojiBuild'):
        return 'pficon-build';
      case('Advisory'):
      case('ContainerAdvisory'):
        return 'pficon-security';
      case('FreshmakerEvent'):
        return 'estuary-icon-freshmaker';
      case('ContainerKojiBuild'):
        return 'pficon-build';
      default:
        return 'fa-cube';
    }
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
