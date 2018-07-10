import { PipeTransform, Pipe } from '@angular/core';

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
  // This Pipe formats node property values to its display form (e.g. show
  // objects as an inuitive string)
  transform(value): String {
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
      } else {
        return null;
      }
    } else {
      return value;
    }
  }
}
