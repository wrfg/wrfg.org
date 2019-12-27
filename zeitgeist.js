import { ZonedDateTime, ZoneId } from "@js-joda/core"
import "@js-joda/timezone"

const spans = (show, now) => {
  let next = now
  while (next.dayOfWeek().name().toLowerCase() !== show.day.toLowerCase()) {
    next = next.plusDays(1)
  }
  const start = next.with(show.start)
  const end = start.plus(show.duration)

  const atOrAfterStart = start.equals(now) || start.isBefore(now)
  const beforeEnd = end.isAfter(now)

  return atOrAfterStart && beforeEnd
}

export default ({ shows }) => {
  const time = ZonedDateTime.now(ZoneId.of("America/New_York"))

  const airshifts = shows.map((show) => show.airshifts.map((airshift) => [show, airshift])).reduce((accumulation, item) => accumulation.concat(item), []).sort((x, y) => sortByStart(x[1], y[1]))

  const index = airshifts.reduce((accumulation, [show, airshift], index) => {
    if (accumulation !== null) {
      return accumulation
    }

    if (spans(airshift, time)) {
      return index
    }

    return null
  }, null)

  const now = index !== null
    ? {
      airshift: airshifts[index][1],
      show: airshifts[index][0],
    }
    : null

  const next = airshifts[index + 1]
    ? {
      airshift: airshifts[index + 1][1],
      show: airshifts[index + 1][0],
    }
    : null

  return [
    now,
    next,
  ]
}
