import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "@/components/layout"

import { Stack } from '@/components/parts'

import Program from "@/models/program"

export default ({ data }) => {
  const page = data.markdownRemark
  const program = Program.factory(page)

  return (
    <Layout title={program.title}>
      <Stack>
        <h1>{program.title}</h1>
        <div>
          <h4>Shows</h4>
          {program.shows.length
            ? <ul>{program.shows.map((show) => <li key={show.slug}><Link to={show.slug}>{show.title}</Link></li>)}</ul>
            : <p>No shows</p>
          }
        </div>
      </Stack>
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
