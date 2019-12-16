import React from "react"

import { ZonedDateTime, ZoneId, DateTimeFormatter } from "@js-joda/core"
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

const Now = () => {
  const now = ZonedDateTime.now(ZoneId.of("America/New_York"))

  const data = useStaticQuery(
    graphql`
      {
      allMarkdownRemark(filter: {fields: {kind: {eq: "shows"}}}) {
        edges {
          node {
            id
            frontmatter {
              title
              start
              duration
              day
            }
            fields {
              slug
            }
          }
        }
      }
    }
    `
  )

  const shows = data.allMarkdownRemark.edges.map((edge) => edge.node).map(Show.factory).sort(sortByStart)

  const index = shows.reduce((accumulation, show, index) => {
    if (accumulation !== null) {
      return accumulation
    }

    if (spans(show, now)) {
      return index
    }

    return null
  }, null)

  const current = index !== null ? shows[index] : null
  const next = index !== null ? shows[(index + 1) % shows.length] : null

  return (
    <>
      <p>
        The time is now {now.format(DateTimeFormatter.ofPattern('M/d/yyyy H:mm:ss'))} in Atlanta, Georgia.
        {current && (<><br /><Link to={current.slug}>{current.title}</Link> is currently on air.</>)}
        {next && (<><br />Up next is <Link to={next.slug}>{next.title}</Link>.</>)}
        {!(current || next) && (<><br />Something is probably on air.</>)}
      </p>
    </>
  )
}

const Loadable = loadable(() => import("./now"))

export default Now
export { Loadable }
