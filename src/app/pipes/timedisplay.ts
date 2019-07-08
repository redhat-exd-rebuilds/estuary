import { PipeTransform, Pipe } from '@angular/core';


@Pipe({name: 'timeDisplay'})
export class TimeDisplayPipe implements PipeTransform {
    transform(timeInSeconds: number): string {
        if (timeInSeconds / 86400 >= 1) {
            const days = Math.floor(timeInSeconds / 86400);
            timeInSeconds = timeInSeconds % 86400;
            const hours = Math.floor(timeInSeconds / 3600);
            timeInSeconds = timeInSeconds % 3600;
            const minutes = Math.floor(timeInSeconds / 60);
            return `${days} days, ${hours} hours, ${minutes} minutes`;
        } else if (timeInSeconds / 3600 >= 1) {
            const hours = Math.floor(timeInSeconds / 3600);
            timeInSeconds = timeInSeconds % 3600;
            const minutes = Math.floor(timeInSeconds / 60);
            timeInSeconds = timeInSeconds % 60;
            return `${hours} hours, ${minutes} minutes, ${timeInSeconds} seconds`;
        } else if (timeInSeconds / 60 >= 1) {
            const minutes = Math.floor(timeInSeconds / 60);
            timeInSeconds = timeInSeconds % 60;
            return `${minutes} minutes, ${timeInSeconds} seconds`;
        } else {
            return `${timeInSeconds} seconds`;
        }
    }
}
