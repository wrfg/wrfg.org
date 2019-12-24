import React, { Fragment } from "react"

import { Link, graphql } from "gatsby"

import Layout from "@/components/layout.js"

import Archive from "@/models/archive.js"

export default ({ data }) => {
  const archives = data.allMarkdownRemark.edges.map((edge) => edge.node).map(Archive.factory)

  return (
    <Layout>
      <h1>Archives</h1>
      <ul>
      {archives.map((archive) => {
        return <li key={archive.slug}><Link to={archive.slug}>{archive.title}</Link></li>
      })}
      </ul>
    </Layout>
  )
}

export const query = graphql`
  {
    allMarkdownRemark(filter: {fields: {kind: {eq: "archives"}}}) {
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
