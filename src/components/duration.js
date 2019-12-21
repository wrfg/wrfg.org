import React from "react"

import pluralize from "pluralize"

export default ({ value }) => {
  const hours = parseInt(value.toHours(), 10)
  const minutes = value.minusHours(hours).toMinutes()

  if (minutes === 0) {
    return (<span>{hours} {pluralize('hour', hours)}</span>)
  }

  if (hours === 0) {
    return (<span>{minutes} {pluralize('minute', minutes)}</span>)
  }

  return (<span>{hours} {pluralize('hour', hours)} and {minutes} {pluralize('minute', minutes)}</span>)
}
