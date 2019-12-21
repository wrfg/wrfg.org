import React from "react"
import { graphql } from "gatsby"

import Layout from "@/components/layout.js"

export default ({ data }) => {
  const page = data.markdownRemark

  return (
    <Layout>
      <h1>{page.frontmatter.title}</h1>
      <p>TODO a list of shows</p>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`
