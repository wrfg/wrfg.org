import React from "react"

import { ChronoField } from "@js-joda/core"

const format = ({ value }) => {
  const hour = value.get(ChronoField.CLOCK_HOUR_OF_AMPM)
  const minute = value.get(ChronoField.MINUTE_OF_HOUR)
  const meridiem = value.get(ChronoField.AMPM_OF_DAY)
  return (
    <span>
      {hour}
      {minute > 0 && `:${minute.toString().padStart(2, '0')}`}
      {meridiem ? 'pm' : 'am'}
    </span>
  )
}

export default format