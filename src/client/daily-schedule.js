import React, { Fragment, useState } from "react"

import { css } from "@emotion/core"

import { Link, useStaticQuery, graphql } from "gatsby"

import Show, { sortByStart } from "@/models/show.js"

import Time from "@/components/time.js"

const Day = ({ day, airshifts }) => {
  return (
    <Fragment key={day}>
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
}

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

  const [ day, setDay ] = useState(days[0])
  const airshifts = allAirshifts.filter(([show, airshift]) => airshift.day === day).sort((x, y) => sortByStart(x[1], y[1]))

  return (
    <>
      <p>
        {days.map((givenDay) => {
          return (
            <button
              onClick={(e) => setDay(givenDay)}
              css={css`
                border: none;
                color: ${day === givenDay ? 'black' : 'blue'};
                text-decoration: ${day === givenDay ? 'none' : 'underline'};
                background: transparent;
                height: 1.6em;
                text-align: center;
                display: inline-block;
              `}
              key={givenDay}
            >
              {givenDay}
            </button>
          )
        })}
      </p>
      <Day day={day} airshifts={airshifts} />
    </>
  )
}

export default DailySchedule
