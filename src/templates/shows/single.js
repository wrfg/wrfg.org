import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "@/components/layout.js"

import Show from "@/models/show.js"

import Duration from "@/components/duration.js"
import Time from "@/components/time.js"

export default ({ data }) => {
  const page = data.markdownRemark
  const show = Show.factory(page)

  return (
    <Layout>
      <h1>{show.title}</h1>
      {show.program && (<>
        <h4>Program</h4>
        <p><Link to={show.program.slug}>{show.program.title}</Link></p>
      </>)}
      <h4>Airshifts</h4>
      <ul>
      {show.airshifts.map((airshift, index) => {
        return (
          <li key={index}>{airshift.day}s at <Time value={airshift.start} /> for <Duration value={airshift.duration} /></li>
        )
      })}
      </ul>
      <h4>Archives</h4>
      {show.archives.length
        ? (<ul>{show.archives.map((archive, index) => {
          return (
            <li key={index}><Link to={archive.slug}>{archive.title}</Link></li>
          )
        })
        }</ul>)
        : <p>No archives</p>
      }
      <h4>Notes</h4>
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
        archives {
          frontmatter {
            title
          }
          fields {
            slug
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
