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
        let prevNode = null;
        for (const node of story.data) {
          // If the user searched for a Build that happens to be a Container Build,
          // the API will return a story with the node labeled as a Container Build,
          // but since the API URLs in this app are constructed with node.resource_type,
          // we must overwrite the value to 'KojiBuild' so that clicking on the node
          // will replicate the user's search
          if (prevNode && prevNode.resource_type === 'DistGitCommit' && node.resource_type === 'ContainerKojiBuild') {
            node.resource_type = 'KojiBuild';
          }
          prevNode = node;
        }
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
