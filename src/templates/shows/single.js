import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "@/components/layout.js"

import { Stack, ExternalLink, Spread, FullWidthImage, PlainHtml } from '@/components/parts'

import { ShowImageSquare } from '@/components/show'

import Show from "@/models/show.js"

import Time from "@/components/time.js"

const Range = ({ start, end }) => {
  return <><Time value={start} />{' - '}<Time value={end} /></>
}

const Shift = ({ value }) => {
  return (
    <>
      {value.day}s <Range start={value.start} end={value.end} />
    </>
  )
}

const ShiftSummary = ({ airshifts }) => {
  if (airshifts.length === 1) {
    return <Shift value={airshifts[0]} />
  }

  const first = airshifts[0]
  const sameTime = airshifts.reduce((accumulation, item) => {
    return accumulation && item.start === first.start && item.end === first.end
  }, true)
  if (sameTime) {
    const days = airshifts.map((airshift) => airshift.day).map((day) => {
      return {
        'Sunday': 0,
        'Monday': 1,
        'Tuesday': 2,
        'Wednesday': 3,
        'Thursday': 4,
        'Friday': 5,
        'Saturday': 6,
      }[day]
    }).sort().map((ordinal) => {
      return {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday',
      }[ordinal]
    })
    let range = `${days[0]} - ${days[days.length - 1]}`
    if (range === 'Monday - Friday') {
      range = 'Weekdays'
    }
    return <>{range} <Range start={first.start} end={first.end} /></>
  }

  return (
    <ul>
    {airshifts.map((airshift, index) => {
      return (
        <li key={index}><Shift value={airshift} /></li>
      )
    })}
    </ul>
  )
}

export default ({ data }) => {
  const page = data.markdownRemark
  const show = Show.factory(page)

  return (
    <Layout title={show.title}>
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
            {page.html && (<PlainHtml html={page.html} />)}
          </Stack>
        </div>
        <div>
          <ShowImageSquare show={show} />
        </div>
      </Spread>
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
