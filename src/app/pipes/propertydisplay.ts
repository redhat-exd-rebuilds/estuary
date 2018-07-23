import { PipeTransform, Pipe } from '@angular/core';
import { DatePipe } from '@angular/common';


@Pipe({name: 'propertyDisplay'})
export class PropertyDisplayPipe implements PipeTransform {
  // This Pipe formats node property names to its display form (e.g. replace
  // underscores with spaces, capitalization, etc.)
  transform(property: string): string {
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


@Pipe({name: 'propertyValueDisplay'})
export class PropertyValueDisplayPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  // This Pipe formats node property values to its display form (e.g. show
  // objects as an inuitive string)
  transform(value): String {
    const dtRegEx = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(?:\.\d+)?(?:Z|[-+]00(?::00)?)?$/;
    // Can't use typeof to determine if it's an Array
    if (value instanceof Array) {
      return value.length.toString();
    } else if (value instanceof Object) {
      // Only display objects' name or username properties
      if (value.name) {
        return value.name;
      } else if (value.username) {
        return value.username;
      } else if (value.hash) {
        return value.hash;
      } else if (value.id) {
        return value.id;
      } else {
        return '';
      }
    } else if (dtRegEx.test(value)) {
      return this.datePipe.transform(value, 'MMMM d, y, HH:mm:ss', '+0000') + ' UTC';
    } else if (value === null) {
      // Rather than return null, just return an empty string for consistent types
      return '';
    } else {
      return value;
    }
  }
}
