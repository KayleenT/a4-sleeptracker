import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bed, removeCircleOutline } from 'ionicons/icons';
import { SleepService } from '../services/sleep.service';
import { ReminderService } from '../services/reminder.service';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, IonIcon, IonButton, DatePipe, FormsModule],
})
export class HomePage {
  today = new Date();

  // overnight sleep inputs (24 hour "HH:MM" strings from the time inputs)
  sleptAt = '22:30';
  wokeAt = '07:00';
  sleepMessage = '';

  // sleepiness inputs, 0 means nothing has been picked yet
  levels = [1, 2, 3, 4, 5, 6, 7];
  selectedLevel = 0;
  scale = StanfordSleepinessData.ScaleValues;
  tiredMessage = '';

  // sleepiness reminder times as "HH:MM" strings
  reminderTimes: string[] = [];
  addingReminder = false;
  newTime = '12:00';
  reminderMessage = '';

  constructor(private sleepService: SleepService, private reminderService: ReminderService) {
    addIcons({ bed, removeCircleOutline });

    // show the reminders the user saved last time
    this.reminderTimes = this.reminderService.getSettings().reminderTimes;
  }

  // shows how long the user slept before they save, look like "8H 30M"
  get hoursSlept(): string {
    if (!this.sleptAt || !this.wokeAt || this.sleptAt === this.wokeAt) {
      return '--';
    }

    const [sleptHour, sleptMinute] = this.sleptAt.split(':').map(Number);
    const [wokeHour, wokeMinute] = this.wokeAt.split(':').map(Number);

    let minutes = (wokeHour * 60 + wokeMinute) - (sleptHour * 60 + sleptMinute);

    // went to bed before midnight, so add a full day
    if (minutes < 0) {
      minutes += 24 * 60;
    }

    return Math.floor(minutes / 60) + 'H ' + (minutes % 60) + 'M';
  }

  saveSleep() {
    try {
      this.sleepService.logOvernightFromTime(this.sleptAt, this.wokeAt);
      this.sleepMessage = 'Sleep saved!';
    } catch (error) {
      this.sleepMessage = (error as Error).message;
    }
  }

  pickLevel(level: number) {
    this.selectedLevel = level;
    this.tiredMessage = '';
  }

  submitTiredness() {
    try {
      this.sleepService.addSleepiness(this.selectedLevel);
      this.tiredMessage = 'Logged! Check back in later.';
      this.selectedLevel = 0;
    } catch (error) {
      this.tiredMessage = (error as Error).message;
    }
  }

  async addReminder() {
    // keep the list in time order
    const times = [...this.reminderTimes, this.newTime].sort();
    const saved = await this.saveReminders(times);

    if (saved) {
      this.addingReminder = false;
    }
  }

  async removeReminder(time: string) {
    const times = this.reminderTimes.filter((t) => t !== time);
    await this.saveReminders(times);
  }

  // reschedules the notifications with the new list, returns false if something went wrong
  async saveReminders(times: string[]): Promise<boolean> {
    try {
      await this.reminderService.updateSettings({
        ...this.reminderService.getSettings(),
        enabled: times.length > 0,
        reminderTimes: times,
      });
      this.reminderTimes = times;
      this.reminderMessage = '';
      return true;
    } catch (error) {
      this.reminderMessage = (error as Error).message;
      return false;
    }
  }

  // turns "16:30" into "4:30 pm"
  formatTime(time: string): string {
    const [hour, minute] = time.split(':').map(Number);
    const amPm = hour < 12 ? 'am' : 'pm';
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;

    return hour12 + ':' + String(minute).padStart(2, '0') + ' ' + amPm;
  }
}
