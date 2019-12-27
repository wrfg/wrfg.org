import React from "react"

import { ZonedDateTime, ZoneId } from "@js-joda/core"
import "@js-joda/timezone"

import { Link, useStaticQuery, graphql } from "gatsby"

import loadable from "@loadable/component"

import Show, { sortByStart } from "@/models/show.js"

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

const Now = ({ shows }) => {
  const now = ZonedDateTime.now(ZoneId.of("America/New_York"))

  const airshifts = shows.map((show) => show.airshifts.map((airshift) => [show, airshift])).reduce((accumulation, item) => accumulation.concat(item), []).sort((x, y) => sortByStart(x[1], y[1]))

  const index = airshifts.reduce((accumulation, [show, airshift], index) => {
    if (accumulation !== null) {
      return accumulation
    }

    if (spans(airshift, now)) {
      return index
    }

    return null
  }, null)

  const current = index !== null ? airshifts[index] : null

  if (!current) {
    return null
  }

  const next = airshifts[index + 1] ? airshifts[index + 1][0] : null

  const show = current[0]

  return (
    <>
      <p><Link to={show.slug}>{show.title}</Link> is currently on air.</p>
      {next ? (<p>Up next is <Link to={next.slug}>{next.title}</Link>.</p>) : null}
    </>
  )
}

const Loadable = loadable(() => import("./now"))

export default Now
export { Loadable }
