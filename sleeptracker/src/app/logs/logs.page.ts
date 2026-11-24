import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Component({
  selector: 'app-logs',
  templateUrl: 'logs.page.html',
  styleUrls: ['logs.page.scss'],
  imports: [IonContent, DatePipe],
})
export class LogsPage {
  sleepLogs: OvernightSleepData[] = [];
  tiredLogs: StanfordSleepinessData[] = [];

  constructor(private sleepService: SleepService) {}

  // runs every time the page is opened, so new logs from the home page show up
  ionViewWillEnter() {
    // reverse so the newest logs are at the top
    this.sleepLogs = this.sleepService.getOvernightHistory().reverse();
    this.tiredLogs = this.sleepService.getSleepinessHistory().reverse();
  }
}
