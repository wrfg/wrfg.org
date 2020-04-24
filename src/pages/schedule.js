import React, { useState } from "react"

import { Link, graphql } from "gatsby"

import now from "@/now.js"
import Layout from "@/components/layout.js"
import Time from "@/components/time.js"

import { Dropdown } from '@/components/forms'

import { Stack, Spread, VerticallyCenter } from '@/components/parts'

import { ShowImageSquare } from '@/components/show'

import Show, { sortByStart, zeitgeist } from "@/models/show.js"

const Currently = ({ current, next }) => {
  return (
    <Spread gap={2} splits={[1, 4]}>
      <div>
        <ShowImageSquare show={current.show} />
      </div>
      <VerticallyCenter>
        <h3><Link to={current.show.slug}>{current.show.title}</Link> is on air.</h3>
        {next && (
          <div>Up next is <Link to={next.show.slug}>{next.show.title}</Link>.</div>
        )}
      </VerticallyCenter>
    </Spread>
  )
}

const Day = ({ day, airshifts }) => {
  return (
    <Stack gap={1}>
      {airshifts.map(([show, airshift]) => {
        return (
          <div key={show.id}>
            <Time value={airshift.start} />&nbsp;-&nbsp;<Time value={airshift.end} />{' '}<Link to={show.slug}>{show.title}</Link>
          </div>
        )
      })}
    </Stack>
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
    <Stack gap={1}>
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
    </Stack>
  )
}

export default ({ data }) => {
  const shows = data.allMarkdownRemark.edges.map((edge) => edge.node).map(Show.factory)

  const [ current, next ] = zeitgeist(shows)

  return (
    <Layout title="Schedule">
      <Stack>
        {current && (<>
          <div><h2>Now</h2></div>
          <div><Currently current={current} next={next} /></div>
        </>)}
        <div>
          <h2>Schedule</h2>
        </div>
        <div>
          <DailySchedule shows={shows}  />
        </div>
      </Stack>
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
            banner_image
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
