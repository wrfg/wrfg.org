import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "@/components/layout.js"

export default ({ data }) => {
  const shows = data.allMarkdownRemark.edges.map((edge) => edge.node)

  return (
    <Layout>
      <h1>Shows</h1>
      <ul>
      {shows.map((show) => {
        return (
          <li key={show.id}><Link to={show.fields.slug}>{show.frontmatter.title}</Link></li>
        )
      })}
      </ul>
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
          }
          fields {
            slug
          }
        }
      }
    }
  }
`


