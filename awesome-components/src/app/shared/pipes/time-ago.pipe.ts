import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform, LOCALE_ID, Inject } from '@angular/core';

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private locale: string) {}

  timeDiffs = {
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    year: 365 * 24 * 60 * 60 * 1000,
  };

  transform(value: string | Date): any {
    const now = Date.now();
    const then = new Date(value).getTime();
    const diff = now - then;
    if (diff < this.timeDiffs.minute) {
      return 'Le ' + value + ' (Il y a quelques secondes)';
    } else if (diff < this.timeDiffs.hour) {
      return ' (Il y a quelques minutes)';
    } else if (diff < this.timeDiffs.day) {
      return ' (Il y a quelques heures)';
    } else if (diff < this.timeDiffs.week) {
      return (
        'Le ' +
        new DatePipe(this.locale).transform(value, 'd MMMM yyyy, à HH:mm') +
        ' (Il y a quelques jours)'
      );
    } else if (diff < this.timeDiffs.month) {
      return ' (Il y a quelques semaines)';
    } else if (diff < this.timeDiffs.year) {
      return (
        'Le ' +
        new DatePipe(this.locale).transform(value, 'd MMMM yyyy, à HH:mm') +
        ' (Il y a quelques mois)'
      );
    } else {
      return (
        'Le ' +
        new DatePipe(this.locale).transform(value, 'd MMMM yyyy, à HH:mm') +
        " (Il y a plus d'un an)"
      );
    }
  }
}
