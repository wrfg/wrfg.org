import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "@/components/layout"

import Program from "@/models/program"

export default ({ data }) => {
  const page = data.markdownRemark
  const program = Program.factory(page)

  return (
    <Layout>
      <h1>{program.title}</h1>
      <h4>Shows</h4>
      {program.shows.length
        ? (<ul>{program.shows.map((show, index) => {
          return (<li key={show.slug}><Link to={show.slug}>{show.title}</Link></li>)
        })
        }</ul>)
        : <p>No shows</p>
      }
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
      }
      shows {
        id
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
