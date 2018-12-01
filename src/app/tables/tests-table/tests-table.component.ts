import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { GreenwaveDecision } from '../../models/greenwave.type';


@Component({
  selector: 'app-tests-table',
  templateUrl: './tests-table.component.html',
})
export class TestsTableComponent implements OnChanges {

  @Input() greenwaveDecision: GreenwaveDecision;
  @Input() subjectIdentifier: string;
  @Output() error = new EventEmitter<string>();
  formattedResults: Array<any>;
  title: string;
  defaultColumns: Array<string>;
  defaultSortedColumn: string;
  uidColumn: string;
  linkColumnMappings: any;

  constructor() {
    this.defaultColumns = ['ID', 'Logs', 'Status', 'Test Case', 'Waived'];
    this.defaultSortedColumn = 'ID';
    this.uidColumn = 'ID';
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName of Object.keys(changes)) {
      if (propName === 'greenwaveDecision') {
        // Only call this if the greenwaveDecision object changes since this is an expensive
        // function call
        this.processDecision();
        break;
      }
    }
  }

  processDecision() {
    this.formattedResults = [];
    this.linkColumnMappings = {};
    this.title = `Test Results for ${this.subjectIdentifier}`;
    if (!this.greenwaveDecision) {
      return;
    }

    const waivedTestCases = this.greenwaveDecision.waivers
      .filter(waiver => waiver.waived)
      .map(waiver => waiver.testcase);

    this.formattedResults = this.greenwaveDecision.results.map(result => {
      const formattedResult = {
        'ID': result.id,
        'Item': result.data.item,
        'Status': result.outcome,
        'Test Case': result.testcase.name,
        'Logs': 'No logs available',
        'Waived': waivedTestCases.includes(result.testcase.name) ? 'Yes' : 'No',
      };

      this.linkColumnMappings[result.id] = {
        'ID': result.href,
        'Test Case': result.testcase.href,
      };

      if (result.data.log) {
        formattedResult['Logs'] = 'Test Run Logs';
        this.linkColumnMappings[result.id]['Logs'] = result.data.log;
      }

      return formattedResult;
    });
  }

  onChildError(errorMsg: string) {
    this.error.emit(errorMsg);
  }
}
