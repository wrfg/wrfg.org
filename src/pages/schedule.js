import React from "react"

import { graphql } from "gatsby"

import Layout from "@/components/layout.js"

import Now from "@/client/now.js"

import DailySchedule from "@/client/daily-schedule.js"

import Show, { zeitgeist } from "@/models/show.js"

export default ({ data }) => {
  const shows = data.allMarkdownRemark.edges.map((edge) => edge.node).map(Show.factory)

  const [ now, next ] = zeitgeist(shows)

  return (
    <Layout>
      <h1>Now</h1>
      <Now now={now} next={next} />
      <h1>Schedule</h1>
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
