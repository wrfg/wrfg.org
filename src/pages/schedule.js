import React, { Fragment } from "react"

import { Link, graphql } from "gatsby"

import Layout from "@/components/layout.js"

import Now from "@/client/now.js"

import Show, { sortByStart } from "@/models/show.js"

import Time from "@/components/time.js"

export default ({ data }) => {
  const allShows = data.allMarkdownRemark.edges.map((edge) => edge.node).map(Show.factory)
  const allAirshifts = allShows.map((show) => {
    return show.airshifts.map((airshift) => [show, airshift])
  }).reduce((accumulation, item) => accumulation.concat(item), [])

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  return (
    <Layout>
      <h1>Now</h1>
      <Now />
      <h1>Schedule</h1>
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
