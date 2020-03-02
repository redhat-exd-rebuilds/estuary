import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linkColumnType'
})
export class LinkColumnTypePipe implements PipeTransform {

  transform(item: any): String {
    if (item === undefined) {
      return;
    }

    const dataType = typeof item;
    // For now, all objects are classified as 'multiple', but could be changed in the future.
    // Note that some objects may be of length 1, (and thus not technically multiple)  but
    // they still count as 'multiple' for templating purposes
    if (dataType === 'object') {
      return 'multiple';
    } else {
      return 'single';
    }
  }

}
