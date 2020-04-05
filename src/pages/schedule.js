import React, { Fragment, useState } from "react"

import { css } from "@emotion/core"

import { Link, graphql } from "gatsby"

import now from "@/now.js"
import Layout from "@/components/layout.js"
import Time from "@/components/time.js"

import Show, { sortByStart, zeitgeist } from "@/models/show.js"

const Currently = ({ current, next }) => {
  return (
    <>
      <p><Link to={current.show.slug}>{current.show.title}</Link> is currently on air.</p>
      {next ? (<p>Up next is <Link to={next.show.slug}>{next.show.title}</Link>.</p>) : null}
    </>
  )
}

const Day = ({ day, airshifts }) => {
  return (
    <Fragment key={day}>
      <table>
        <tbody>
          {airshifts.map(([show, airshift]) => {
            return (
              <tr key={show.id}>
                <td css={css`vertical-align: top;`}>
                  <Time value={airshift.start} />&nbsp;-&nbsp;<Time value={airshift.end} />
                </td>
                <td css={css`vertical-align: top;`}>
                  <Link to={show.slug}>{show.title}</Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Fragment>
  )
}

const DailySchedule = ({ shows }) => {
  const allAirshifts = shows.map((show) => {
    return show.airshifts.map((airshift) => [show, airshift])
  }).reduce((accumulation, item) => accumulation.concat(item), [])

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

  const [ day, setDay ] = useState(now.dayOfWeek().name().toLowerCase())
  const airshifts = allAirshifts
    .filter(([show, airshift]) => airshift.day.toLowerCase() === day.toLowerCase())
    .sort((x, y) => sortByStart(x[1], y[1]))

  return (
    <>
      <p>
        {days.map((givenDay) => {
          return (
            <button
              onClick={(e) => setDay(givenDay)}
              css={css`
                border: none;
                text-transform: capitalize;
                text-decoration: ${day === givenDay ? 'none' : 'underline'};
                font-family: serif;
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

export default ({ data }) => {
  const shows = data.allMarkdownRemark.edges.map((edge) => edge.node).map(Show.factory)

  const [ current, next ] = zeitgeist(shows)

  return (
    <Layout title="Schedule">
      {current && (<>
        <h2>Now</h2>
        <Currently current={current} next={next} />
      </>)}
      <h2>Schedule</h2>
      <DailySchedule shows={shows}  />
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
