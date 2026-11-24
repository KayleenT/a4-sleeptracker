import { SleepData } from "./sleep-data";

export class OvernightSleepData extends SleepData {
  private sleepStart: Date;
  private sleepEnd: Date;

  constructor(sleepStart: Date, sleepEnd: Date) {
    super();
    this.sleepStart = sleepStart;
    this.sleepEnd = sleepEnd;
  }

  // returns the time the user went to bed
  public getSleepStart(): Date {
    return this.sleepStart;
  }

  // returns the time that the user woke up
  public getSleepEnd(): Date {
    return this.sleepEnd;
  }

  override summaryString(): string {
    var sleepStart_ms = this.sleepStart.getTime();
    var sleepEnd_ms = this.sleepEnd.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = sleepEnd_ms - sleepStart_ms;

    // Convert to hours and minutes, e.g. "8H 30M" (same as the home page)
    return (
      Math.floor(difference_ms / (1000 * 60 * 60)) +
      "H " +
      Math.floor((difference_ms / (1000 * 60)) % 60) +
      "M"
    );
  }

  override dateString(): string {
    return (
      "Night of " +
      this.sleepStart.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    );
  }
}
