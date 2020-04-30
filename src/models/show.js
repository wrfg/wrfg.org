import { useMemo } from "react"

import { useStaticQuery, graphql } from "gatsby"

import { LocalTime, Duration } from "@js-joda/core"

import Archive from "./archive.js"
import Program from "./program.js"

const toLocalTime = (time) => {
  let hours = parseInt(time.split(":")[0], 10)
  const minutes = parseInt(time.split(":")[1].substring(0, 2), 10)
  const meridiem = time.slice(-1)

  if (meridiem === "a") {
    if (hours === 12) {
      hours = 0
    }
  } else if (meridiem === "p") {
    if (hours !== 12) {
      hours += 12
    }
  } else {
    throw new Error(`Unparsable time \`${time}\``)
  }

  return LocalTime.of(hours, minutes)
}

const toDuration = (duration) => {
  const [ hours, minutes ] = duration.split(":").map((part) => parseInt(part, 10))
  return Duration.ofHours(hours).plusMinutes(minutes)
}

class Airshift {
  constructor(data) {
    this.data = data
  }
  get day() {
    return this.data.day
  }
  get start() {
    return toLocalTime(this.data.start)
  }
  get end() {
    return toLocalTime(this.data.start).plus(this.duration)
  }
  get duration() {
    return toDuration(this.data.duration)
  }
  static factory(data) {
    return new Airshift(data)
  }
}

class Show {
  constructor(data) {
    this.data = data
  }
  get id() {
    return this.data.id
  }
  get slug() {
    return this.data.fields.slug
  }
  get title() {
    return this.data.frontmatter.title
  }
  get day() {
    return this.data.frontmatter.day
  }
  get websiteUrl() {
    return this.data.frontmatter.website_url
  }
  get bannerImageUrl() {
    return this.data.frontmatter.banner_image
  }
  get start() {
    return toLocalTime(this.data.frontmatter.start)
  }
  get duration() {
    return toDuration(this.data.frontmatter.duration)
  }
  get end() {
    return this.start.plus(this.duration)
  }
  get program() {
    return Program.factory(this.data.program)
  }
  get airshifts() {
    return this.data.frontmatter.airshifts.map((data) => Airshift.factory(data))
  }
  get archives() {
    return (this.data.archives || []).map((data) => {
      return Archive.factory(data)
    })
  }
  static factory(data) {
    if (data.frontmatter.title) {
      return new Show(data)
    }

    return null
  }
}

const all = [new Show({title: 'My Show'})]

const dayAsOrdinal = (day) => {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day)
}

const sortByStart = (x, y) => {
  if (dayAsOrdinal(x.day) < dayAsOrdinal(y.day)) {
    return -1
  }

  if (dayAsOrdinal(x.day) > dayAsOrdinal(y.day)) {
    return 1;
  }

  if (x.start.isBefore(y.start)) {
    return -1
  }

  if (x.start.isAfter(y.start)) {
    return 1
  }

  if (x.start.equals(y.start)) {
    return 0
  }

  throw new Error(`Somehow two times are not equal, not greater, and not less than each other`)
}

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

const zeitgeist = (shows, now) => {
  const time = now

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

  const current = index !== null
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
    current,
    next,
  ]
}

const useShows = () => {
  const data = useStaticQuery(
    graphql`
      {
      allMarkdownRemark(filter: {fields: {kind: {eq: "shows"}}}) {
        edges {
          node {
            id
            frontmatter {
              title
              airshifts {
                start
                duration
                day
              }
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

  const shows = useMemo(() => data.allMarkdownRemark.edges.map((edge) => edge.node).map(Show.factory), [data])

  return shows
}

export default Show
export { all, sortByStart, zeitgeist, useShows }
