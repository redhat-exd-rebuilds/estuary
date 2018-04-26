import { Component, OnInit, AfterViewInit, Input, ElementRef, Directive } from '@angular/core';

import { Connection as jsPlumbConnection } from 'jsplumb';

// The TypeScript definitions are missing a few functions we need. I submitted a PR at
// https://github.com/jsplumb/jsplumb/pull/736. In the meantime, lets use any as the type.
declare var jsPlumb: any;


@Directive({
  selector: '[appPlumbConnect]'
})
export class PlumbConnectDirective implements AfterViewInit {
  @Input('appPlumbConnect') nodeIDs: Array<String> = [];

  constructor(private element: ElementRef) { }

  ngAfterViewInit() {
    let that = this;
    // We have to wait for jsPlumb to be ready before doing any connections
    jsPlumb.bind('ready', function() {
      that.nodeIDs.forEach(nodeID => {
        jsPlumb.connect({
          source: nodeID,
          target: that.element.nativeElement.id,
          endpoint : 'Blank',
          connector : ['Flowchart', {cornerRadius: 3}],
          anchor: ['Bottom', 'Top'],
          paintStyle: {stroke: 'black', strokeWidth: 2},
        });
      });
    });
  }
}


@Component({
  selector: 'app-storyrow',
  templateUrl: './storyrow.component.html',
  styleUrls: ['./storyrow.component.css']
})
export class StoryRowComponent implements OnInit, AfterViewInit {
  @Input('nodes') nodes: Array<object>;
  @Input('nodeType') nodeType: String;
  private nodeShape: String;
  private prevNodeIDs: Array<String> = [];

  constructor(private element: ElementRef) { }

  ngOnInit() {
    this.nodeShape = this.getNodeShape();
    this.prevNodeIDs = this.getPreviousNodes();
    // Don't draw until the view is initialized
    jsPlumb.setSuspendDrawing(true);
  }

  ngAfterViewInit() {
    // Any connections have now been made, so the drawing can continue
    jsPlumb.setSuspendDrawing(false, true);
  }

  getNodeShape(): String {
    switch(this.nodeType.toLowerCase()) {
      case('bugzillabug'):
      case('distgitcommit'):
      case('freshmakerevent'):
        return 'circle';

      default:
        return 'rectangle';
    }
  }

  getPreviousNodes(): Array<String> {
    let prevNodeIDs = [];
    let previousSibling = this.element.nativeElement.previousElementSibling;

    if (previousSibling && previousSibling.tagName === 'APP-STORYROW') {
      if (previousSibling.children) {
        let nodes = Array.from(previousSibling.children[0].children);
        nodes.forEach(function(node: HTMLElement) {
          // Only connect with HTML elements that have the class "item"
          if (Array.from(node.classList).includes('item')) {
            prevNodeIDs.push(node.id);
          }
       });
      }
    }

    return prevNodeIDs;
  }
}
