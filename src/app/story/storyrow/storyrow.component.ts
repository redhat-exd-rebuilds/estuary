import { Component, OnInit, AfterViewInit, Input, ElementRef, Directive } from '@angular/core';

import { Connection as jsPlumbConnection } from 'jsplumb';

// The TypeScript definitions are missing a few functions we need. I submitted a PR at
// https://github.com/jsplumb/jsplumb/pull/736. In the meantime, lets use any as the type.
declare var jsPlumb: any;


@Directive({
  selector: '[appPlumbConnect]'
})
export class PlumbConnectDirective implements AfterViewInit {
  @Input('appPlumbConnect') nodeIDs: Array<String> = []; // tslint:disable-line

  constructor(private element: ElementRef) { }

  ngAfterViewInit() {
    const that = this;
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
  @Input() node: any;
  @Input() relatedNodes: Number;
  @Input() active: Boolean;
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
    switch (this.node.resource_type.toLowerCase()) {
      case('bugzillabug'):
      case('distgitcommit'):
      case('freshmakerevent'):
        return 'circle';

      default:
        return 'rectangle';
    }
  }

  getPreviousNodes(): Array<String> {
    const prevNodeIDs = [];
    const previousSibling = this.element.nativeElement.previousElementSibling;

    if (previousSibling && previousSibling.tagName === 'APP-STORYROW') {
      // The second row connects to all nodes in the previous row, where as
      // all others just connect to the first node in the previous row
      const isSecondRow = previousSibling.id === 'storyRow0';
      const previousRow: Array<HTMLElement> = Array.from(previousSibling.children);
      previousRow.forEach(function(column: HTMLElement) {
        if (column.classList.contains('mainItem')) {
          prevNodeIDs.push(column.children[0].id);
        } else if (isSecondRow && column.classList.contains('secondaryItem') && column.children.length) {
          prevNodeIDs.push(column.children[0].id);
        }
      });
    }

    return prevNodeIDs;
  }

  getNodeDisplayName(): String {
    switch (this.node.resource_type) {
      case('BugzillaBug'):
        return 'Bug';
      case('DistGitCommit'):
        return 'Commit';
      case('KojiBuild'):
        return 'Build';
      case('FreshmakerEvent'):
        return 'Freshmaker';
      case('ContainerBuilds'):
        return 'Containers';
      default:
        return this.node.resource_type;
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
        return 'pficon-security';
      case('FreshmakerEvent'):
        return 'fa-refresh';
      case('ContainerBuilds'):
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
