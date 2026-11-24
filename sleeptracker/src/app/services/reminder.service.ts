import { Injectable } from "@angular/core";
import {
  LocalNotifications,
  LocalNotificationSchema,
} from "@capacitor/local-notifications";

// stores the user's personalized reminder preferences
export interface ReminderSettings {
  enabled: boolean;
  wakeUpTime: string;
  bedTime: string;
  reminderTimes: string[];
}

@Injectable({
  providedIn: "root",
})
export class ReminderService {
  // key used to store reminder preferences in local storage
  private readonly storageKey = "sleepReminderSettings";

  // default reminder settings for new users
  private settings: ReminderSettings = {
    enabled: false,
    wakeUpTime: "07:00",
    bedTime: "23:00",
    reminderTimes: [],
  };

  constructor() {
    // load previously saved reminder preferences
    this.loadSettings();
  }

  // validate the user's reminder settings
  private validateSettings(settings: ReminderSettings): void {
    if (typeof settings.enabled !== "boolean") {
      throw new Error("Invalid reminder status");
    }

    // make sure the times use a valid 24-hour format
    const timeFormat = /^([01]\d|2[0-3]):[0-5]\d$/;

    if (
      !timeFormat.test(settings.wakeUpTime) ||
      !timeFormat.test(settings.bedTime)
    ) {
      throw new Error("Invalid time format");
    }

    if (settings.wakeUpTime === settings.bedTime) {
      throw new Error("Wake-up time and bedtime must be different");
    }

    if (!Array.isArray(settings.reminderTimes)) {
      throw new Error("Invalid reminder times");
    }

    if (settings.reminderTimes.length > 8) {
      throw new Error("A maximum of 8 daytime reminders is allowed");
    }

    // check that each selected reminder time is valid
    for (const time of settings.reminderTimes) {
      if (typeof time !== "string" || !timeFormat.test(time)) {
        throw new Error("Invalid reminder time");
      }
    }

    // prevent reminders from being scheduled at the same time
    const allTimes = [
      settings.wakeUpTime,
      ...settings.reminderTimes,
      settings.bedTime,
    ];

    if (new Set(allTimes).size !== allTimes.length) {
      throw new Error("Duplicate reminder times are not allowed");
    }
  }

  // check and request permission to send notifications
  public async requestPermission(): Promise<boolean> {
    const permission = await LocalNotifications.checkPermissions();

    if (permission.display === "granted") {
      return true;
    }

    const result = await LocalNotifications.requestPermissions();

    return result.display === "granted";
  }

  // create a notification that repeats daily at the selected time
  private createNotification(
    id: number,
    title: string,
    body: string,
    time: string
  ): LocalNotificationSchema {
    const [hours, minutes] = time.split(":").map(Number);

    return {
      id: id,
      title: title,
      body: body,
      schedule: {
        on: {
          hour: hours,
          minute: minutes,
          second: 0,
        },
        repeats: true,
      },
    };
  }

  // schedule morning, daytime, and bedtime reminders
  private async scheduleReminders(settings: ReminderSettings): Promise<void> {
    const notifications: LocalNotificationSchema[] = [];

    // remind the user to log overnight sleep after waking up
    notifications.push(
      this.createNotification(
        100,
        "Good morning!",
        "How much sleep did you get last night?",
        settings.wakeUpTime
      )
    );

    // schedule reminders at the times selected by the user
    for (let i = 0; i < settings.reminderTimes.length; i++) {
      notifications.push(
        this.createNotification(
          101 + i,
          "Sleepiness Check",
          "How sleepy are you feeling right now?",
          settings.reminderTimes[i]
        )
      );
    }

    // remind the user to log sleepiness before going to bed
    notifications.push(
      this.createNotification(
        110,
        "Bedtime Check",
        "Log your sleepiness before going to bed.",
        settings.bedTime
      )
    );

    // register the reminders with the device
    await LocalNotifications.schedule({
      notifications: notifications,
    });
  }

  // save reminder preferences to local storage
  private saveSettings(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
  }

  // restore previously saved reminder preferences
  private loadSettings(): void {
    const savedSettings = localStorage.getItem(this.storageKey);

    if (savedSettings === null) {
      return;
    }

    try {
      const settings: ReminderSettings = JSON.parse(savedSettings);

      this.validateSettings(settings);
      this.settings = settings;
    } catch {
      localStorage.removeItem(this.storageKey);
    }
  }

  // return a copy of the current reminder settings
  public getSettings(): ReminderSettings {
    return {
      ...this.settings,
      reminderTimes: [...this.settings.reminderTimes],
    };
  }

  // cancel previously scheduled sleep reminders
  private async cancelReminders(): Promise<void> {
    const pending = await LocalNotifications.getPending();

    // only cancel notifications belonging to the sleep reminder system
    const reminders = pending.notifications.filter(
      (notification) => notification.id >= 100 && notification.id <= 110
    );

    if (reminders.length > 0) {
      await LocalNotifications.cancel({
        notifications: reminders,
      });
    }
  }

  // replace the old reminder schedule and save the new preferences
  public async updateSettings(settings: ReminderSettings): Promise<void> {
    this.validateSettings(settings);

    if (settings.enabled) {
      const granted = await this.requestPermission();

      if (!granted) {
        throw new Error("Notification permission was denied");
      }
    }

    // remove old reminders to prevent duplicate notifications
    await this.cancelReminders();

    // only schedule new reminders if they are enabled
    if (settings.enabled) {
      await this.scheduleReminders(settings);
    }

    // store and save the updated preferences
    this.settings = {
      ...settings,
      reminderTimes: [...settings.reminderTimes],
    };

    this.saveSettings();
  }
}
