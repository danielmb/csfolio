export type TimeFormatType =
  | "SHORT_TIME"
  | "MEDIUM_TIME"
  | "LONG_TIME"
  | "FULL_TIME";

export type DateFormatType =
  | "SHORT_DATE"
  | "MEDIUM_DATE"
  | "LONG_DATE"
  | "FULL_DATE";

export type DateTimeFormatType = TimeFormatType | DateFormatType;

export const DateTimeFormats: Record<
  DateTimeFormatType,
  Intl.DateTimeFormatOptions
> = {
  SHORT_DATE: { day: "2-digit", month: "2-digit", year: "numeric" },
  SHORT_TIME: { hour: "2-digit", minute: "2-digit" },
  MEDIUM_DATE: { day: "2-digit", month: "short", year: "numeric" },
  MEDIUM_TIME: { hour: "2-digit", minute: "2-digit", second: "2-digit" },
  LONG_DATE: {
    day: "2-digit",
    month: "long",
    year: "numeric",
  },
  LONG_TIME: {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  },
  FULL_DATE: {
    day: "2-digit",
    month: "long",
    year: "numeric",
    weekday: "long",
  },
  FULL_TIME: {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "long",
  },
};
