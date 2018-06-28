import { Component, AfterViewInit, Input, ElementRef, Directive, Host } from '@angular/core';

import { StoryComponent } from '../story.component';


@Component({
  selector: 'app-storyrow',
  templateUrl: './storyrow.component.html',
  styleUrls: ['./storyrow.component.css']
})
export class StoryRowComponent implements AfterViewInit {
  @Input() node: any;
  @Input() relatedNodes: Number;
  @Input() active: Boolean;
  @Input() last: Boolean;
  story: StoryComponent;

  constructor(@Host() story: StoryComponent) {
    this.story = story;
  }

  ngAfterViewInit() {
    if (this.last) {
      // If it's the last row in the story, then call the connectStory method on
      // the parent component to draw the lines
      this.story.connectStory();
    }
  }

  getNodeIconClass(): String {
    switch (this.node.resource_type) {
      case('BugzillaBug'):
        return 'fa-bug';
      case('DistGitCommit'):
        return 'pficon-bundle';
      case('KojiBuild'):
        return 'pficon-build';
      case('Advisory'):
      case('ContainerAdvisory'):
        return 'pficon-security';
      case('FreshmakerEvent'):
        return 'fa-refresh';
      case('ContainerKojiBuild'):
        return 'pficon-build';
      default:
        return 'fa-cube';
    }
  }

  getNodeUid(): String {
    switch (this.node.resource_type) {
      case('DistGitCommit'):
        return this.node.hash;
      default:
        return this.node.id;
    }
  }
}
