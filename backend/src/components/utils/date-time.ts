export function isWithinExpirationDate(date: Date): boolean {
  return Date.now() < date.getTime();
}

export function createDate(timeSpan: TimeSpan): Date {
  return new Date(Date.now() + timeSpan.milliseconds());
}

export type TimeSpanUnit = 'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'y';

export class TimeSpan {
  constructor(value: number, unit: TimeSpanUnit) {
    this.value = value;
    this.unit = unit;
  }

  public value: number;
  public unit: TimeSpanUnit;

  public milliseconds(): number {
    if (this.unit === 'ms') {
      return this.value;
    }
    if (this.unit === 's') {
      return this.value * 1000;
    }
    if (this.unit === 'm') {
      return this.value * 1000 * 60;
    }
    if (this.unit === 'h') {
      return this.value * 1000 * 60 * 60;
    }
    if (this.unit === 'd') {
      return this.value * 1000 * 60 * 60 * 24;
    }
    if (this.unit === 'w') {
      return this.value * 1000 * 60 * 60 * 24 * 7;
    }
    if (this.unit === 'y') {
      return this.value * 1000 * 60 * 60 * 24 * 365;
    }
    return this.value;
  }

  public seconds(): number {
    return this.milliseconds() / 1000;
  }

  public transform(x: number): TimeSpan {
    return new TimeSpan(Math.round(this.milliseconds() * x), 'ms');
  }
}
