import React from "react"
import { Link, graphql } from "gatsby"

import { LocalTime } from "@js-joda/core"

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

export default ({ data }) => {
  const allShows = data.allMarkdownRemark.edges.map((edge) => edge.node)

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  return (
    <Layout>
      <h1>Schedule</h1>
      {days.map((day) => {
        const shows = allShows.filter((show) => show.frontmatter.day === day).sort((x, y) => {
          const xIsLess = -1;
          const xIsMore = 1;
          const same = 0;


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
        })

        if (shows.length === 0) {
          return null
        }


        return (
          <>
            <h2>{day}</h2>
            <table>
              <tbody>
                {shows.map((show) => {
                  return (
                    <tr key={show.id}>
                      <td>{show.frontmatter.start}</td>
                      <td><Link to={show.fields.slug}>{show.frontmatter.title}</Link></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </>
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
