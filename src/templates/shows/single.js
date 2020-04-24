import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "@/components/layout.js"

import { Stack, ExternalLink, Spread, PlainHtml } from '@/components/parts'

import { ShiftSummary, ShowImageSquare } from '@/components/show'

import Show from "@/models/show.js"

export default ({ data }) => {
  const page = data.markdownRemark
  const show = Show.factory(page)

  return (
    <Layout title={show.title}>
      <Stack>
        <Spread gap={2} splits={[2, 1]}>
          <div>
            <Stack>
              <div>
                <h1>{show.title}</h1>
              </div>
              <div>
                <h4>On air</h4>
                <div><ShiftSummary airshifts={show.airshifts} /></div>
              </div>
              {show.program && (<div>
                <h4>Program</h4>
                <div><Link to={show.program.slug}>{show.program.title}</Link></div>
              </div>)}
              {show.websiteUrl && (<div>
                <h4>Links</h4>
                <div><ExternalLink to={show.websiteUrl}>Website</ExternalLink></div>
              </div>)}
              {show.archives.length > 0 && (<div>
                <h4>Archives</h4>
                <ul>
                  {show.archives.map((archive, index) => {
                    return (
                      <li key={index}><Link to={archive.slug}>{archive.title}</Link></li>
                    )
                  })}
                </ul>
              </div>)}
            </Stack>
          </div>
          <div>
            <ShowImageSquare show={show} />
          </div>
        </Spread>
        {page.html && (<PlainHtml html={page.html} />)}
      </Stack>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        website_url
        banner_image
        airshifts {
          day
          start
          duration
        }
      }
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
    }
  }
`
