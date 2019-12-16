import React, { Fragment } from "react"
import { Link, graphql } from "gatsby"

import { LocalTime, Duration } from "@js-joda/core"

import Layout from "@/components/layout.js"

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

const byStart = (x, y) => {
  const xStart = toLocalTime(x.frontmatter.start)
  const yStart = toLocalTime(y.frontmatter.start)

  if (xStart.equals(yStart)) {
    return 0
  }

  if (xStart.isBefore(yStart)) {
    return -1
  }

  if (xStart.isAfter(yStart)) {
    return 1
  }

  throw new Error(`Somehow two times are not equal, not greater, and not less than each other`)
}

export default ({ data }) => {
  const allShows = data.allMarkdownRemark.edges.map((edge) => edge.node)

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  return (
    <Layout>
      <h1>Now</h1>
      <p>{new Date().toLocaleString()}</p>
      <p>Next: Else</p>
      <h1>Schedule</h1>
      {days.map((day) => {
        const shows = allShows.filter((show) => show.frontmatter.day === day).sort(byStart)

        if (shows.length === 0) {
          return null
        }


        return (
          <Fragment key={day}>
            <h2>{day}</h2>
            <table>
              <tbody>
                {shows.map((show) => {
                  const starts = toLocalTime(show.frontmatter.start)
                  const ends = starts.plus(toDuration(show.frontmatter.duration))

                  return (
                    <tr key={show.id}>
                      <td>{starts.toLocaleString()} - {ends.toLocaleString()}</td>
                      <td><Link to={show.fields.slug}>{show.frontmatter.title}</Link></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Fragment>
        )
      })}
    </Layout>
  )
}

export const query = graphql`
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
