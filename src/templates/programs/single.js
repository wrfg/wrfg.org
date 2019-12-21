import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "@/components/layout.js"

export default ({ data }) => {
  const page = data.markdownRemark

  return (
    <Layout>
      <h1>{page.frontmatter.title}</h1>
      {page.frontmatter.shows && (<>
        <h4>Shows</h4>
        <ul>
        {page.frontmatter.shows.map((show) => {
          return (<li key={show.fields.slug}><Link to={show.fields.slug}>{show.frontmatter.title}</Link></li>)
        })}
        </ul>
      </>)}
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        shows {
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`
