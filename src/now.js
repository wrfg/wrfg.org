import { ZonedDateTime, ZoneId } from "@js-joda/core"
import "@js-joda/timezone"

const now = ZonedDateTime.now(ZoneId.of("America/New_York"))

export default now
