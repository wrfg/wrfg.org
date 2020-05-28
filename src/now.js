import { useEffect, useState } from 'react'

import { LocalTime, ZonedDateTime, ZoneId } from "@js-joda/core"
import "@js-joda/timezone"

const timezone = ZoneId.of("America/New_York")

const observe = () => ZonedDateTime.now(timezone)

const now = observe()

const useNow = () => {
  const [now, setNow] = useState(observe())
  useEffect(() => {
    const id = setInterval(() => setNow(observe()), 10000)
    return () => clearInterval(id)
  }, [])
  return now
}

const days = [
  {value: 'sunday', label: 'Sunday'},
  {value: 'monday', label: 'Monday'},
  {value: 'tuesday', label: 'Tuesday'},
  {value: 'wednesday', label: 'Wednesday'},
  {value: 'thursday', label: 'Thursday'},
  {value: 'friday', label: 'Friday'},
  {value: 'saturday', label: 'Saturday'},
]

const range = (to) => [...Array(to).keys()]
const cross = (xs, ys) => {
  const crossed = []
  xs.forEach((x) => {
    ys.forEach((y) => {
      crossed.push([x, y])
    })
  })

  return crossed
}

const times = cross(range(24), range(2).map((x) => x * 30)).map(([hour, minutes]) => LocalTime.of(hour, minutes))

export default now
export { useNow, days, times }
