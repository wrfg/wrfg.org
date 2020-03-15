import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "@/components/layout.js"

import Archive from "@/models/archive.js"

import MixcloudPlayer from "@/client/mixcloud-player.js"

export default ({ data }) => {
  const page = data.markdownRemark
  const archive = Archive.factory(page)

  return (
    <Layout>
      <h1>{archive.title}</h1>
      {archive.show && (<>
        <h4>Show</h4>
        <p><Link to={archive.show.slug}>{archive.show.title}</Link></p>
      </>)}
      <h4>Listen</h4>
      <MixcloudPlayer
        title={archive.title}
        slug={archive.slug}
        url={archive.url}
      />
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
        url
      }
      fields {
        slug
      }
      show {
        fields {
          slug
        }
        frontmatter {
          title
        }
      }
    }
  }
`
