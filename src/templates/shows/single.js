import React from "react"
import { graphql } from "gatsby"

import Layout from "@/components/layout.js"

export default ({ data }) => {
  const page = data.markdownRemark

  return (
    <Layout>
      <h1>{page.frontmatter.title}</h1>
      <p>{page.frontmatter.day}s at {page.frontmatter.start} for {page.frontmatter.duration}</p>
      <div dangerouslySetInnerHTML={{ __html: page.html }} />
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        day
        start
        duration
      }
    }
  }
`
