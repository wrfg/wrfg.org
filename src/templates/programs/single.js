import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "@/components/layout"
import { Stack, Spread, VerticallyCenter } from '@/components/parts'
import { ShiftSummary, ShowImageSquare } from '@/components/show'

import Program from "@/models/program"

export default ({ data }) => {
  const page = data.markdownRemark
  const program = Program.factory(page)

  return (
    <Layout title={program.title}>
      <Stack>
        <h1>{program.title}</h1>
        <Stack>
          <h4>Shows</h4>
          {program.shows.length ? (
            program.shows.map((show) => (
              <Link to={show.slug}>
                <Spread key={show.slug} splits={[1, 4]}>
                  <ShowImageSquare show={show} />
                  <VerticallyCenter>
                    <h3>{show.title}</h3>
                    <ShiftSummary airshifts={show.airshifts} />
                  </VerticallyCenter>
                </Spread>
              </Link>
            ))
          ) : (
            <p>No shows</p>
          )}
        </Stack>
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
          banner_image
          airshifts {
            day
            start
            duration
          }
        }
      }
    }
  }
`
