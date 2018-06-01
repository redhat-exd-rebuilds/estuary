import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'propertyDisplay'})
export class PropertyDisplayPipe implements PipeTransform {
  // This Pipe formats node property names to its display form (e.g. replace
  // underscores with spaces, capitalization, etc.)
  transform(property: String): String {
    if (property === 'id') {
      return property.toUpperCase();
    }
    const rvArray = property.toLowerCase().replace(/_/g, ' ').split(' ');
    for (let i = 0; i < rvArray.length; i++) {
      rvArray[i] = rvArray[i].charAt(0).toUpperCase() + rvArray[i].slice(1);
    }
    let rv = rvArray.join(' ');
    // Edge cases that need capitalization
    if (rv.startsWith('Qa')) {
      rv = 'QA' + rv.slice(2);
    }
    return rv;
  }
}
