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
      let previousRow: Array<HTMLElement> = Array.from(previousSibling.children);
      previousRow.forEach(function(column: HTMLElement) {
        if ((column.classList.contains('mainItem') || column.classList.contains('secondaryItem')) && column.children.length) {
          prevNodeIDs.push(column.children[0].id);
        }
      });
    }

    return prevNodeIDs;
  }

  getNodeUID(nodeType: String): String {
    switch(nodeType) {
      case('BugzillaBug'):
        return 'RHBZ#' + this.nodes[0]['id'];
      case('DistGitCommit'):
        return '#' + this.nodes[0]['hash'].slice(0, 7);
      case('KojiBuild'):
        return `${this.nodes[0]['name']}-${this.nodes[0]['version']}-${this.nodes[0]['release']}`;
      case('Advisory'):
        return this.nodes[0]['advisory_name'];
      default:
        return this.nodes[0]['id'];
    }
  }

  getNodeDisplayName(nodeType: String): String {
    switch(nodeType) {
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
        return nodeType;
    }
  }

  getNodeIconClass(nodeType: String): String {
    switch(nodeType) {
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
}
