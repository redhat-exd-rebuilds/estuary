import { Component, HostListener, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { jsPlumbInstance } from 'jsplumb';

import { StoryService } from '../services/story.service';
import { StoryAPI } from '../models/story.type';


declare var jsPlumb: jsPlumbInstance;


@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit, AfterViewInit, OnDestroy {

  loading: Boolean;
  story: StoryAPI;
  selectedNode: any;
  errorMsg: String;

  constructor(private storyService: StoryService, private route: ActivatedRoute,
              private elRef: ElementRef) { }

  ngOnInit() {
    this.route.params.subscribe((params: ParamMap) => {
      this.loading = true;
      // If the route changes, then remove all the connecting lines
      if (this.story) {
        jsPlumb.reset();
      }
      this.story = null;
      this.selectedNode = null;
      this.getStory(params['resource'], params['uid']);
    });
  }

  ngAfterViewInit() {
    // Set the defaults to jsPlumb after the view is initialized since jsPlumb will now be defined
    jsPlumb.importDefaults({
      Container: 'js-diagram',
      Endpoint : 'Blank',
      Connector : ['Flowchart', {cornerRadius: 3}],
      Anchor: ['Bottom', 'Top'],
      PaintStyle: {
        stroke: '#6A6C6F',
        strokeWidth: 2
      }
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

  connectStory(): void {
    // Get all the story rows in the component
    const storyRows: Array<Element> = Array.from(this.elRef.nativeElement.querySelectorAll('app-storyrow'));
    // Don't show the connecting lines until the whole story has been processed
    jsPlumb.setSuspendDrawing(true);

    // Loop through all the story rows except for the last one, because that
    // relationship flows backwards and is set after the loop
    for (let i = 0; i < storyRows.length - 1; i++) {
      // Connect the main node to the next main node
      const target = storyRows[i + 1].querySelector('.mainItem').children[0];
      jsPlumb.connect({
        source: storyRows[i].querySelector('.mainItem').children[0],
        target: target
      });
      // Check to see if this story row has siblings
      const secondaryItem = storyRows[i].querySelector('.secondaryItem');
      if (secondaryItem) {
        // If there are siblings, connect them to the next main node
        jsPlumb.connect({
          source: secondaryItem.children[0],
          target: target
        });
      }
    }

    // Check to see if the last row has any siblings
    const lastSecondaryItem = storyRows[storyRows.length - 1].querySelector('.secondaryItem');
    if (lastSecondaryItem) {
      // If there are siblings, connect them to the previous main node
      jsPlumb.connect({
        source: lastSecondaryItem.children[0],
        target: storyRows[storyRows.length - 2].querySelector('.mainItem').children[0],
      });
    }

    // The whole story has been processed, so the connecting lines can now be shown
    jsPlumb.setSuspendDrawing(false, true);
  }
}
