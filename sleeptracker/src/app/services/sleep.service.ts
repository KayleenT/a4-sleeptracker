import { Injectable } from "@angular/core";
import { SleepData } from "../data/sleep-data";
import { OvernightSleepData } from "../data/overnight-sleep-data";
import { StanfordSleepinessData } from "../data/stanford-sleepiness-data";

@Injectable({
  providedIn: "root",
})
export class SleepService {
  // key used to store sleep data in local storage
  private readonly storageKey = "sleepTrackerData";
  public static AllSleepData: SleepData[] = [];
  public static AllOvernightData: OvernightSleepData[] = [];
  public static AllSleepinessData: StanfordSleepinessData[] = [];

  constructor() {
    // load previously saved sleep data
    this.loadData();
  }

  // store overnight sleep record + save
  public logOvernightData(sleepData: OvernightSleepData) {
    SleepService.AllSleepData.push(sleepData);
    SleepService.AllOvernightData.push(sleepData);
    this.saveData();
  }

  // validate the sleep times + create the record
  public addOvernightSleep(
    sleepStart: Date,
    sleepEnd: Date
  ): OvernightSleepData {
    if (isNaN(sleepStart.getTime()) || isNaN(sleepEnd.getTime())) {
      throw new Error("Invalid sleep time");
    }

    if (sleepEnd.getTime() <= sleepStart.getTime()) {
      throw new Error("Wake-up time must be after bedtime");
    }

    // only one overnight log per day, so remove any earlier log that woke up on the same day
    const wakeDay = sleepEnd.toDateString();
    SleepService.AllOvernightData = SleepService.AllOvernightData.filter(
      (sleep) => sleep.getSleepEnd().toDateString() !== wakeDay
    );
    SleepService.AllSleepData = SleepService.AllSleepData.filter(
      (sleep) =>
        !(sleep instanceof OvernightSleepData) ||
        sleep.getSleepEnd().toDateString() !== wakeDay
    );

    const sleepData = new OvernightSleepData(sleepStart, sleepEnd);

    this.logOvernightData(sleepData);

    return sleepData;
  }

  // convert selected time into Date objects and log the overnight sleep
  public logOvernightFromTime(
    startTime: string,
    endTime: string
  ): OvernightSleepData {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const sleepStart = new Date();
    const sleepEnd = new Date();

    sleepStart.setHours(startHour, startMinute, 0, 0);
    sleepEnd.setHours(endHour, endMinute, 0, 0);

    // if the bedtime is later than the wakeup time, we assume that the user went asleep the prior night
    if (sleepStart.getTime() > sleepEnd.getTime()) {
      sleepStart.setDate(sleepStart.getDate() - 1);
    }

    return this.addOvernightSleep(sleepStart, sleepEnd);
  }

  // store the sleepiness record and save the updated data
  public logSleepinessData(sleepData: StanfordSleepinessData) {
    SleepService.AllSleepData.push(sleepData);
    SleepService.AllSleepinessData.push(sleepData);
    this.saveData();
  }

  // validate sleepiness level and create a new record
  public addSleepiness(level: number): StanfordSleepinessData {
    if (!Number.isInteger(level) || level < 1 || level > 7) {
      throw new Error("Invalid sleepiness level");
    }

    const sleepData = new StanfordSleepinessData(level, new Date());

    this.logSleepinessData(sleepData);

    return sleepData;
  }

  // return all the overnight sleep records
  public getOvernightHistory(): OvernightSleepData[] {
    return [...SleepService.AllOvernightData];
  }

  // return all the daytime sleepiness records
  public getSleepinessHistory(): StanfordSleepinessData[] {
    return [...SleepService.AllSleepinessData];
  }

  // return all recorded sleep data
  public getAllHistory(): SleepData[] {
    return [...SleepService.AllSleepData];
  }

  // convert sleep records into JSON and save it to local storage
  private saveData(): void {
    const data = {
      overnight: SleepService.AllOvernightData.map((sleep) => ({
        sleepStart: sleep.getSleepStart().toISOString(),
        sleepEnd: sleep.getSleepEnd().toISOString(),
      })),

      sleepiness: SleepService.AllSleepinessData.map((sleep) => ({
        loggedValue: sleep.getLoggedValue(),
        loggedAt: sleep.getLoggedAt().toISOString(),
      })),
    };

    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // restore the saved data from local storage
  private loadData(): void {
    const savedData = localStorage.getItem(this.storageKey);

    if (savedData === null) {
      return;
    }

    const data = JSON.parse(savedData);

    // Recreate the overnight sleep objects from saved data.
    for (const sleep of data.overnight) {
      const sleepData = new OvernightSleepData(
        new Date(sleep.sleepStart),
        new Date(sleep.sleepEnd)
      );

      SleepService.AllOvernightData.push(sleepData);
      SleepService.AllSleepData.push(sleepData);
    }

    // Recreate the sleepiness objects from saved data.
    for (const sleep of data.sleepiness) {
      const sleepData = new StanfordSleepinessData(
        sleep.loggedValue,
        new Date(sleep.loggedAt)
      );

      SleepService.AllSleepinessData.push(sleepData);
      SleepService.AllSleepData.push(sleepData);
    }
  }
}
