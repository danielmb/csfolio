"use client";
import {
  DateFormatType,
  TimeFormatType,
  DateTimeFormats,
} from "./date-time-formats";
import { IDateTimeFormatter } from "./date-time-formatter.interface";

export class DateTimeFormatter implements IDateTimeFormatter {
  private language;

  constructor(lang: string) {
    this.language = lang;
  }

  public formatDateTime = (
    date: Date,
    dateFormatType?: DateFormatType,
    timeFormatType?: TimeFormatType,
  ) => {
    if (!dateFormatType && !timeFormatType) {
      return Intl.DateTimeFormat(this.language, {
        ...DateTimeFormats.MEDIUM_DATE,
        ...DateTimeFormats.SHORT_TIME,
      }).format(date);
    }

    return Intl.DateTimeFormat(this.language, {
      ...(dateFormatType && DateTimeFormats[dateFormatType]),
      ...(timeFormatType && DateTimeFormats[timeFormatType]),
    }).format(date);
  };
}
