import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'keyValuePairs'})
export class KeyValuePairsPipe implements PipeTransform {
  // This pipe is a wrapper around Object.entries to provide an array of arrays
  // with each having a key and a value of an object property (like .items() in Python)
  transform(value): Array<any> {
    return Object.entries(value);
  }
}

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
  // This pipe is a wrapper around Object.keys
  transform(value): Array<any> {
    return Object.keys(value);
  }
}
