import { useEffect, useState } from 'react'

import { ZonedDateTime, ZoneId } from "@js-joda/core"
import "@js-joda/timezone"

const observe = () => ZonedDateTime.now(ZoneId.of("America/New_York"))

const now = observe()

export const useNow = () => {
  const [now, setNow] = useState(observe())
  useEffect(() => {
    const id = setInterval(() => setNow(observe()), 10000)
    return () => clearInterval(id)
  }, [])
  return now
}

export default now
