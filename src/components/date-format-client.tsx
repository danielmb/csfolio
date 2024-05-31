"use client";
import React from "react";
import { useDateTimeFormatter } from "@/app/_layout/date-time-formatter/date-time-formatter-provider";
interface DateFormatClientProps {
  children: Date;
}

export const DateFormatClient: React.FC<DateFormatClientProps> = ({
  children,
}) => {
  const dateTimeFormatter = useDateTimeFormatter();
  return <>{dateTimeFormatter.formatDateTime(children)}</>;
};
