import { ChronoField, ZonedDateTime, ZoneId } from "@js-joda/core"
import "@js-joda/timezone"

const now = ZonedDateTime.now(ZoneId.of("America/New_York"))

const day = now.get(ChronoField.DAY_OF_WEEK)

export default now
export {
  day
}
