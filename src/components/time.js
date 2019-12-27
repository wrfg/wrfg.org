import React from "react"

import { ChronoField } from "@js-joda/core"

export default ({ value }) => {
  const hour = value.get(ChronoField.HOUR_OF_DAY)
  const minute = value.get(ChronoField.MINUTE_OF_HOUR)
  return (<span>{hour.toString().padStart(2, '0')}:{minute.toString().padStart(2, '0')}</span>)
}
