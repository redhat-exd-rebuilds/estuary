import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'nodeUidDisplay'})
export class NodeUidDisplayPipe implements PipeTransform {
  // This Pipe takes a node as input and figures out how to display its unique identifier
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
  // This Pipe takes a node type as input and figures out its type in display form
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
        case('containerbuild'):
            return 'Container Build';
        default:
            return nodeType;
    }
  }
}


@Pipe({name: 'nodeFilterProperties'})
export class NodeFilterPropertiesPipe implements PipeTransform {
  // This Pipe takes a node as input and figures out the properties to return
  transform(node: any): Array<any> {
    const properties = [];
    for (const keyValue of Object.entries(node)) {
        // Have to do this here instead of the for loop to make TypeScript happy
        const [key, value]: Array<any> = keyValue;
        if (value === null || key === 'resource_type') {
            continue;
        }
        // Can't use typeof to determine if it's an Array
        if (value instanceof Array) {
            properties.push([key, value.length]);
        } else if (typeof value === 'object') {
            // Only display objects' name or username properties
            if (value.name) {
                properties.push([key, value.name]);
            } else if (value.username) {
                properties.push([key, value.username]);
            }
        } else {
            properties.push([key, value]);
        }
    }
    return properties;
  }
}


@Pipe({name: 'nodeTypePlural'})
export class NodeTypePluralPipe implements PipeTransform {
    // This Pipe takes a node type as input and figures out its plural form
    transform(nodeType: String): String {
        if (nodeType.endsWith('y')) {
            return `${nodeType.slice(0, -1)}ies`;
        } else {
            return `${nodeType}s`;
        }
    }
}


@Pipe({name: 'nodeExternalUrl'})
export class NodeExternalUrlPipe implements PipeTransform {
    // This Pipe takes a node as input and figures out its external URL
    transform(node: any): String {
        switch (node.resource_type.toLowerCase()) {
            case('bugzillabug'):
                return `https://bugzilla.redhat.com/show_bug.cgi?id=${node.id}`;
            case('distgitcommit'):
                const baseUrl = 'http://pkgs.devel.redhat.com/cgit/';
                if (node.repos.length) {
                    const repo = node.repos[0];
                    return `${baseUrl}${repo.namespace}/${repo.name}/commit/?id=${node.hash}`;
                }
                return baseUrl;
            case('kojibuild'):
                return `https://brew.engineering.redhat.com/brew/buildinfo?buildID=${node.id}`;
            case('advisory'):
                return `http://errata.engineering.redhat.com/advisory/${node.id}`;
            case('freshmakerevent'):
                return `https://freshmaker.engineering.redhat.com/api/1/events/${node.id}`;
            case('containerbuild'):
                return `https://freshmaker.engineering.redhat.com/api/1/builds/${node.id}`;
            default:
                return '';
        }
    }
}


@Pipe({name: 'truncate'})
export class TruncatePipe implements PipeTransform {
  // This Pipe takes text and truncates it
  transform(text: String, maxLength = 150): String {
      if (typeof text === 'string' && text.length > maxLength) {
        return text.slice(0, maxLength) + '…';
      } else {
          return text;
      }
  }
}
