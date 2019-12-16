import React, { Fragment } from "react"

import { Link, graphql } from "gatsby"

import Layout from "@/components/layout.js"

import Now from "@/client/now.js"

import Show, { sortByStart } from "@/models/show.js"

export default ({ data }) => {
  const allShows = data.allMarkdownRemark.edges.map((edge) => edge.node).map(Show.factory)

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  return (
    <Layout>
      <h1>Now</h1>
      <Now />
      <h1>Schedule</h1>
      {days.map((day) => {
        const shows = allShows.filter((show) => show.day === day).sort(sortByStart)

        if (shows.length === 0) {
          return null
        }

        return (
          <Fragment key={day}>
            <h2>{day}</h2>
            <table>
              <tbody>
                {shows.map((show) => {
                  return (
                    <tr key={show.id}>
                      <td>{show.start.toLocaleString()} - {show.end.toLocaleString()}</td>
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
