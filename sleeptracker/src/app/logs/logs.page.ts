import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { removeCircleOutline } from 'ionicons/icons';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

// everything logged on one day, shown together on one card
interface DayLog {
  date: Date;
  sleep?: OvernightSleepData;
  tiredLogs: StanfordSleepinessData[];
}

@Component({
  selector: 'app-logs',
  templateUrl: 'logs.page.html',
  styleUrls: ['logs.page.scss'],
  imports: [IonContent, IonIcon, DatePipe],
})
export class LogsPage {
  days: DayLog[] = [];

  constructor(private sleepService: SleepService) {
    addIcons({ removeCircleOutline });
  }

  // runs every time the page is opened, so new logs from the home page show up
  async ionViewWillEnter() {
    // wait for the saved logs to finish loading when the app first opens
    await this.sleepService.ready;
    this.buildDays();
  }

  // remove a sleep or sleepiness log, then redraw the cards
  deleteLog(log: SleepData) {
    this.sleepService.deleteLog(log);
    this.buildDays();
  }

  // groups all the logs into one card per day
  buildDays() {
    this.days = [];

    // a night of sleep goes on the day the user woke up
    for (const sleep of this.sleepService.getOvernightHistory()) {
      this.findDay(sleep.getSleepEnd()).sleep = sleep;
    }

    for (const tired of this.sleepService.getSleepinessHistory()) {
      this.findDay(tired.getLoggedAt()).tiredLogs.push(tired);
    }

    // newest day at the top, and each day's sleepiness logs in time order
    this.days.sort((a, b) => b.date.getTime() - a.date.getTime());
    for (const day of this.days) {
      day.tiredLogs.sort((a, b) => a.getLoggedAt().getTime() - b.getLoggedAt().getTime());
    }
  }

  // returns the card for this date, making a new one if it doesn't exist yet
  findDay(date: Date): DayLog {
    let day = this.days.find((d) => d.date.toDateString() === date.toDateString());

    if (!day) {
      day = { date: date, tiredLogs: [] };
      this.days.push(day);
    }

    return day;
  }
}
