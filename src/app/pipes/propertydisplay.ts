import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'propertyDisplay'})
export class PropertyDisplayPipe implements PipeTransform {
  // This Pipe formats node property names to its display form (e.g. replace
  // underscores with spaces, capitalization, etc.)
  transform(property: String): String {
    if (property === 'id') {
      return 'ID:';
    }
    const rv = property.toLowerCase().replace('_', ' ').split(' ');
    for (let i = 0; i < rv.length; i++) {
      rv[i] = rv[i].charAt(0).toUpperCase() + rv[i].slice(1);
    }
    return rv.join(' ') + ':';
  }
}
