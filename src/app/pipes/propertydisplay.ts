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
    property = property.replace('koji', 'brew');
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
  transform(value): string {
    const dtRegEx = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(?:\.\d+)?(?:Z|[-+]00(?::00)?)?$/;
    // Can't use typeof to determine if it's an Array
    if (value instanceof Array) {
      // We need to specifically check if this is an advisory so that, if it
      // is one, we can list out its names rather than just a number.
      if (value.length !== 0 && value[0].advisory_name) {
        return value.map(x => x.advisory_name).join(', ');
      } else if (value.length !== 0) {
        return value.length.toString();
      } else {
        // If there is no value, '--' displays better than '0'.
        return '--';
      }
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
    } else if (typeof value === 'number') {
      return value.toString();
    } else if (value === null) {
      // Rather than return null, just return an empty string for consistent types
      return '';
    } else {
      return value;
    }
  }
}
