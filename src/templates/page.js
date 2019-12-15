import React from "react"
import { graphql } from "gatsby"

export default ({ data }) => {
  const page = data.markdownRemark
  return (
    <div dangerouslySetInnerHTML={{ __html: page.html }} />
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
    }
  }
`
