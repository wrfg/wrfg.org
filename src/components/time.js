import React from "react"

import { DateTimeFormatter, ChronoField } from "@js-joda/core"

export default ({ value }) => {
  const meridiem = value.get(ChronoField.AMPM_OF_DAY) === 0 ? 'am' : 'pm'
  let hour = value.get(ChronoField.HOUR_OF_AMPM)
  if (hour === 0) {
    hour = 12
  }
  const minute = value.get(ChronoField.MINUTE_OF_HOUR)

  return (<span>{hour}:{minute.toString().padStart(2, '0')}{meridiem === 'am' ? 'a' : 'p'}</span>)
}
