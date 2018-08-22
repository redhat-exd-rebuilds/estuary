import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'nodeTypeDisplay'})
export class NodeTypeDisplayPipe implements PipeTransform {
  // This Pipe takes a node type as input and figures out its type in display form
  transform(nodeType: string): string {
    switch (nodeType.toLowerCase()) {
        case('bugzillabug'):
            return 'Bugzilla Bug';
        case('distgitcommit'):
            return 'Commit';
        case('kojibuild'):
            return 'Build';
        case('advisory'):
            return 'Advisory';
        case('freshmakerevent'):
            return 'Freshmaker Event';
        case('containerkojibuild'):
            return 'Container Build';
        case('containeradvisory'):
            return 'Container Advisory';
        default:
            return nodeType;
    }
  }
}


@Pipe({name: 'nodeTypePlural'})
export class NodeTypePluralPipe implements PipeTransform {
    // This Pipe takes a node type as input and figures out its plural form
    transform(nodeType: string): string {
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
    transform(node: any): string {
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
            case('containerkojibuild'):
                return `https://brewweb.engineering.redhat.com/brew/buildinfo?buildID=${node.id}`;
            case('advisory'):
            case('containeradvisory'):
                return `http://errata.engineering.redhat.com/advisory/${node.id}`;
            case('freshmakerevent'):
                return `https://freshmaker.engineering.redhat.com/api/1/events/${node.id}`;
            case('kojitag'):
                return `https://brewweb.engineering.redhat.com/brew/taginfo?tagID=${node.id}`;
            default:
                return '';
        }
    }
}


@Pipe({name: 'truncate'})
export class TruncatePipe implements PipeTransform {
  // This Pipe takes text and truncates it
  transform(text: string, maxLength = 150): string {
      if (typeof text === 'string' && text.length > maxLength) {
        return text.slice(0, maxLength) + '…';
      } else {
          return text;
      }
  }
}
