import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'nodeUidDisplay'})
export class NodeUidDisplayPipe implements PipeTransform {
  // This Pipe takes a node as input and figures out how to display it's unique identifier
  transform(node: any): String {
    switch (node.resource_type.toLowerCase()) {
        case('bugzillabug'):
            return 'RHBZ#' + node.id;
        case('distgitcommit'):
            return '#' + node.hash.slice(0, 7);
        case('kojibuild'):
            return `${node.name}-${node.version}-${node.release}`;
        case('advisory'):
            return node.advisory_name;
        default:
            return node.id;
    }
  }
}


@Pipe({name: 'nodeTypeDisplay'})
export class NodeTypeDisplayPipe implements PipeTransform {
  // This Pipe takes a node type as input and figures out it's type in display form
  transform(nodeType: String): String {
    switch (nodeType.toLowerCase()) {
        case('bugzillabug'):
            return 'Bugzilla Bug';
        case('distgitcommit'):
            return 'Commit';
        case('kojibuild'):
            return 'Brew Build';
        case('advisory'):
            return 'Advisory';
        case('freshmakerevent'):
            return 'Freshmaker Event';
        case('containerbuilds'):
            return 'Container Build';
        default:
            return nodeType;
    }
  }
}
