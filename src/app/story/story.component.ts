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

  loading: boolean;
  story: StoryAPI;
  selectedNode: any;

  constructor(private storyService: StoryService, private route: ActivatedRoute,
              private elRef: ElementRef) {
    this.loading = true;
  }

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

  getStory(resource: string, uid: string) {
    this.loading = true;
    this.storyService.getStory(resource, uid).subscribe(
      story => {
        this.selectedNode = story.data[story.meta.requested_node_index];
        this.story = story;
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }

  getSiblingsRouterLink(nodeWithSiblings, relWithPrevNode = false): Array<any> {
    let nodeWithRel;
    const queryParams = {};
    if (relWithPrevNode === true) {
      // If the passed in node has a relationship with the previous node in the story,
      // then query from the previous node's forward relationship
      nodeWithRel = this.story.data[this.story.data.indexOf(nodeWithSiblings) - 1];
    } else {
      // If the passed in node has a relationship with the next node in the story,
      // then query from the next node's backward relationship
      nodeWithRel = this.story.data[this.story.data.indexOf(nodeWithSiblings) + 1];
      queryParams['backward_rel'] = true;
    }
    // This parameter specifies which story flow to take to get the siblings
    queryParams['story_type'] = this.story.meta.story_type;

    let nodeWithRelUid;
    if (nodeWithRel.resource_type.toLowerCase() === 'distgitcommit') {
      nodeWithRelUid = nodeWithRel.hash;
    } else {
      nodeWithRelUid = nodeWithRel.id;
    }
    return [`/siblings/${nodeWithRel.resource_type.toLowerCase()}/${nodeWithRelUid}`, queryParams];
  }

  connectStory(): void {
    jsPlumb.bind('ready', () => {
      // Get all the story rows in the component
      const storyRows: Array<Element> = Array.from(this.elRef.nativeElement.querySelectorAll('app-storyrow'));
      // Don't show the connecting lines until the whole story has been processed
      jsPlumb.setSuspendDrawing(true);

      // Loop through all the story rows except for the last one, because that
      // relationship flows backwards and is set after the loop
      for (let i = 0; i < storyRows.length - 1; i++) {
        // Connect the main node to the next main node
        const nextNode = storyRows[i + 1].querySelector('.node-column').children[0];
        jsPlumb.connect({
          source: storyRows[i].querySelector('.node-column').children[0],
          target: nextNode
        });
        // Check to see if this story row has siblings
        const backwardSiblings = storyRows[i].querySelector('.node-siblings-backward-column');
        if (backwardSiblings) {
          // If there are backward siblings, connect them to the previous main node
          jsPlumb.connect({
            source: storyRows[i - 1].querySelector('.node-column').children[0],
            target: backwardSiblings.children[0]
          });
        }
        const forwardSiblings = storyRows[i].querySelector('.node-siblings-forward-column');
        if (forwardSiblings) {
          // If there are forward siblings, connect them to the next main node
          jsPlumb.connect({
            source: forwardSiblings.children[0],
            target: nextNode
          });
        }
      }

      // Check to see if the last row has any siblings
      const lastSiblings = storyRows[storyRows.length - 1].querySelector('.node-siblings-backward-column');
      if (lastSiblings) {
        // If there are siblings, connect them to the previous main node
        jsPlumb.connect({
          source: lastSiblings.children[0],
          target: storyRows[storyRows.length - 2].querySelector('.node-column').children[0],
        });
      }

      // The whole story has been processed, so the connecting lines can now be shown
      jsPlumb.setSuspendDrawing(false, true);
    });
  }
}
