import React, { Fragment, useState } from "react"

import { css } from "@emotion/core"

import { Link, graphql } from "gatsby"

import now from "@/now.js"
import Layout from "@/components/layout.js"
import Time from "@/components/time.js"

import { Dropdown } from '@/components/forms'

import Show, { sortByStart, zeitgeist } from "@/models/show.js"

const Currently = ({ current, next }) => {
  return (
    <>
      <div><Link to={current.show.slug}>{current.show.title}</Link> is currently on air.</div>
      {next && (
        <div>Up next is <Link to={next.show.slug}>{next.show.title}</Link>.</div>
      )}
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

  const [ day, setDay ] = useState(now.dayOfWeek().name().toLowerCase())
  const airshifts = allAirshifts
    .filter(([show, airshift]) => airshift.day.toLowerCase() === day.toLowerCase())
    .sort((x, y) => sortByStart(x[1], y[1]))

  return (
    <>
      <Dropdown
        value={day}
        onChange={setDay}
        options={[
          {value: 'sunday', label: 'Sunday'},
          {value: 'monday', label: 'Monday'},
          {value: 'tuesday', label: 'Tuesday'},
          {value: 'wednesday', label: 'Wednesday'},
          {value: 'thursday', label: 'Thursday'},
          {value: 'friday', label: 'Friday'},
          {value: 'saturday', label: 'Saturday'},
        ]}
      />
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
