import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "@/components/layout.js"

import Show from "@/models/show.js"

import Duration from "@/components/duration.js"
import Time from "@/components/time.js"

export default ({ data }) => {
  const page = data.markdownRemark
  const show = new Show(page)

  return (
    <Layout>
      <h1>{show.title}</h1>
      {show.program && show.program.frontmatter.title && (<>
        <h4>Program</h4>
        <p><Link to={show.program.fields.slug}>{show.program.frontmatter.title}</Link></p>
      </>)}
      <h4>Airshifts</h4>
      <ul>
      {show.airshifts.map((airshift, index) => {
        return (
          <li key={index}>{airshift.day}s at <Time value={airshift.start} /> for <Duration value={airshift.duration} /></li>
        )
      })}
      </ul>
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
        program {
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
        airshifts {
          day
          start
          duration
        }
      }
    }
  }
`
