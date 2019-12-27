import React, { Fragment } from "react"

import { Link, useStaticQuery, graphql } from "gatsby"

import Show, { sortByStart } from "@/models/show.js"

import Time from "@/components/time.js"

const DailySchedule = ({ shows }) => {

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
  const allAirshifts = shows.map((show) => {
    return show.airshifts.map((airshift) => [show, airshift])
  }).reduce((accumulation, item) => accumulation.concat(item), [])

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  return (
    <>
      {days.map((day) => {
        const airshifts = allAirshifts.filter(([show, airshift]) => airshift.day === day).sort((x, y) => sortByStart(x[1], y[1]))

        if (airshifts.length === 0) {
          return null
        }

        return (
          <Fragment key={day}>
            <h2>{day}</h2>
            <table>
              <tbody>
                {airshifts.map(([show, airshift]) => {
                  return (
                    <tr key={show.id}>
                      <td><Time value={airshift.start} /> - <Time value={airshift.end} /></td>
                      <td><Link to={show.slug}>{show.title}</Link></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Fragment>
        )
      })}
    </>
  )
}

export default DailySchedule
