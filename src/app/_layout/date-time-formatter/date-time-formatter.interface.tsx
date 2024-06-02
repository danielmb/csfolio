import type { DateFormatType, TimeFormatType } from "./date-time-formats";

export interface IDateTimeFormatter {
  formatDateTime: (
    date: Date,
    dateFormat?: DateFormatType,
    timeFormat?: TimeFormatType,
  ) => string;
}
