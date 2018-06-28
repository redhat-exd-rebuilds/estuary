import { Component, AfterViewInit, HostListener, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { StoryService } from '../services/story.service';
import { StoryAPI } from '../models/story.type';


// The TypeScript definitions are missing a few functions we need. I submitted a PR at
// https://github.com/jsplumb/jsplumb/pull/736. In the meantime, lets use any as the type.
declare var jsPlumb: any;


@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit, OnDestroy {

  loading: Boolean;
  story: StoryAPI;
  selectedResource: String;
  selectedNode: any;
  errorMsg: String;

  constructor(private storyService: StoryService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: ParamMap) => {
      this.loading = true;
      // If the route changes, then remove all the connections
      jsPlumb.reset();
      this.story = null;
      this.selectedResource = params['resource'];
      this.selectedNode = null;
      this.getStory(params['resource'], params['uid']);
    });
  }

  ngOnDestroy() {
    // If the component is destroyed, reset all the connections
    jsPlumb.reset();
  }

  // TODO: Figure out a more efficient way here
  @HostListener('window:resize')
  onResize() {
    // If the window is made smaller and media queries change the position of
    // the elements, we must repaint the connections.
    jsPlumb.repaintEverything();
  }

  getStory(resource: String, uid: String) {
    this.loading = true;
    this.storyService.getStory(resource, uid).subscribe(
      story => {
        this.selectedNode = story.data[story.meta.requested_node_index];
        this.story = story;
        this.loading = false;
      },
      errorResponse => {
        this.errorMsg = errorResponse.error.message;
        this.loading = false;
      }
    );
  }
}
