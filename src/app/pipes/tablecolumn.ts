import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'tableColumn'})
export class TableColumnPipe implements PipeTransform {
  transform(uid: string, uidColumn: any, columnName: string, mapping: any): any {
    return (
        uidColumn
        && mapping
        && mapping[uid]
        && mapping[uid][columnName]
    );
  }
}
