import { Component, OnChanges, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';

import { PropertyDisplayPipe, PropertyValueDisplayPipe } from '../../pipes/propertydisplay';
import { NodeExternalUrlPipe } from '../../pipes/nodedisplay';


@Component({
  selector: 'app-artifacts-table',
  templateUrl: './artifacts-table.component.html',
})
export class ArtifactsTableComponent implements OnChanges {

  @Input() artifacts: Array<any>;
  @Input() title: string;
  @Input() csvFileName: string;
  @Input() tableSpacing = true;
  formattedArtifacts: Array<any>;
  preformattedColumns: Array<string>;
  defaultColumns: Array<string>;
  defaultSortedColumn: string;
  uidColumn: string;
  linkColumnMappings: any;

  constructor(private datePipe: DatePipe) {
    this.preformattedColumns = ['Log Message'];
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName of Object.keys(changes)) {
      if (propName === 'artifacts') {
        // Only call this if the artifacts array changes since this is an expensive
        // function call
        this.processArtifacts();
        break;
      }
    }
  }

  processArtifacts(): void {
    this.formattedArtifacts = [];
    this.defaultColumns = [];
    this.defaultSortedColumn = null;
    this.linkColumnMappings = {};

    if (!this.artifacts || this.artifacts.length === 0) {
      return;
    }

    this.defaultColumns = this.getDefaultColumns(this.artifacts[0].resource_type);
    if (this.artifacts[0].resource_type.toLowerCase() === 'distgitcommit') {
      this.uidColumn = this.defaultSortedColumn = 'Hash';
    } else {
      this.uidColumn = this.defaultSortedColumn = 'ID';
    }

    const propDisplayPipe = new PropertyDisplayPipe();
    const propValDisplayPipe = new PropertyValueDisplayPipe(this.datePipe);
    const externalUrlPipe = new NodeExternalUrlPipe();
    this.formattedArtifacts = this.artifacts.map(artifact => {
      const formattedArtifact = {};
      for (const [key, value] of Object.entries(artifact)) {
        // Exclude these columns since they are implementation details
        if (!['resource_type', 'display_name'].includes(key)) {
          const formattedKey = propDisplayPipe.transform(key);
          formattedArtifact[formattedKey] = propValDisplayPipe.transform(value);
        }
      }

      // Add a link mapping in the form of:
      // {
      //   734506: {
      //     ID: 'https://koji.domain.local/koji/buildinfo?buildID=734506'
      //   }
      //   ...
      // }
      this.linkColumnMappings[formattedArtifact[this.uidColumn]] = {
        [this.uidColumn]: externalUrlPipe.transform(artifact)
      };

      return formattedArtifact;
    });
  }

  getDefaultColumns(resource: string) {
    let columns: Array<string>;
    switch (resource.toLowerCase()) {
      case ('bugzillabug'):
        columns = ['id', 'modified_time', 'assignee', 'reporter', 'short_description', 'status'];
        break;
      case ('distgitcommit'):
        columns = ['author', 'hash', 'commit_date', 'log_message'];
        break;
      case ('kojibuild'):
      case ('containerkojibuild'):
      case ('modulekojibuild'):
        columns = ['id', 'completion_time', 'name', 'owner', 'release', 'version'];
        break;
      case ('containeradvisory'):
      case ('advisory'):
        columns = ['advisory_name', 'update_date', 'assigned_to', 'id', 'security_impact', 'state', 'synopsis'];
        break;
      case ('freshmakerevent'):
        columns = ['id', 'state_name', 'state_reason', 'successful_koji_builds'];
        break;
      case ('distgitrepo'):
        columns = ['commits', 'name', 'namespace'];
        break;
      case ('distgitbranch'):
        columns = ['repos', 'repo_name', 'repo_namespace'];
        break;
      case ('kojitag'):
        columns = ['builds', 'id', 'name'];
        break;
      case ('freshmakerbuild'):
        columns = ['id', 'name', 'original_nvr', 'rebuilt_nvr'];
        break;
      default:
        columns = ['id'];
    }
    const propDisplayPipe = new PropertyDisplayPipe();
    return columns.map(v => propDisplayPipe.transform(v));
  }
}
