import { PipeTransform, Pipe } from '@angular/core';


@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
  // This pipe is a wrapper around Object.keys
  transform(value): Array<any> {
    return Object.keys(value);
  }
}
