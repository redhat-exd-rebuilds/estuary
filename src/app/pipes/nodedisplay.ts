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
