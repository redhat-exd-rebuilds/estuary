import { Component, AfterViewInit, HostListener, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { StoryService } from '../services/story.service';


// The TypeScript definitions are missing a few functions we need. I submitted a PR at
// https://github.com/jsplumb/jsplumb/pull/736. In the meantime, lets use any as the type.
declare var jsPlumb: any;


@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit, OnDestroy {

  // Currently unused but we should use this for a loading bar of some kind
  loading: Boolean;
  story: Array<any> = [];

  constructor(private storyService: StoryService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: ParamMap) => {
      this.loading = true;
      // If the route changes, then remove all the connections
      jsPlumb.reset();
      this.story = [];
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
      data => {
        this.story = data;
      },
      error => {
        // TODO: Change me to be an alert
        console.error(error);
      },
      () => {
        this.loading = false;
      }
    );
  }
}
