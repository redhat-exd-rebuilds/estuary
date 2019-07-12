import { PipeTransform, Pipe } from '@angular/core';


@Pipe({name: 'timeDisplay'})
export class TimeDisplayPipe implements PipeTransform {
    transform(timeInSeconds: number, shortened = false): string {
        if (timeInSeconds === null) {
            return 'Unavailable';
        }

        let timeInSecondsLeft = timeInSeconds;
        const days = Math.floor(timeInSecondsLeft / 86400);
        timeInSecondsLeft = timeInSecondsLeft % 86400;
        const hours = Math.floor(timeInSecondsLeft / 3600);
        timeInSecondsLeft = timeInSecondsLeft % 3600;
        const minutes = Math.floor(timeInSecondsLeft / 60);
        timeInSecondsLeft = timeInSecondsLeft % 60;
        const seconds = Math.floor(timeInSecondsLeft);

        // We need to keep a count in case there is 0 of a given unit of time, but one of its
        // preceding units of time is > 0. For example: 2 days 0 hours 0 minutes.
        let count = 0;
        let time = '';
        if (days > 0) {
            time = this.transformHelper(time, days, 'days', shortened);
            count++;
        }
        if (hours > 0 || count === 1) {
            time = this.transformHelper(time, hours, 'hours', shortened);
            count++;
        }
        if (minutes > 0 || count >= 1) {
            time = this.transformHelper(time, minutes, 'minutes', shortened);
            count++;
        }
        if (days === 0 && seconds > 0 || days === 0 && count >= 1) {
            time = this.transformHelper(time, seconds, 'seconds', shortened);
        }
        if (time === '') {
            if (shortened) {
                time = '0s';
            } else {
                time = '0 seconds';
            }
        }

        return time;
    }

    transformHelper(time: string, timeValue: number, timeUnit: string, shortened: boolean): string {
        let newTime = time;
        if (newTime !== '') {
            newTime += ' ';
        }
        newTime += timeValue;
        if (shortened === true) {
            newTime += timeUnit.charAt(0);
        } else {
            newTime += ' ' + timeUnit;
        }
        return newTime;
    }
}
