import React from "react"
import { graphql } from "gatsby"

import Layout from "@/components/layout.js"

import { Stack, PlainHtml, FullWidthImage } from '@/components/parts'

import { css } from "@emotion/core"

import remark from "remark"
import html from "remark-html"

export default ({ data }) => {
  const page = data.markdownRemark
  const sections = page.frontmatter.sections

  return (
    <Layout title={page.frontmatter.title}>
      <Stack>
        {sections && sections.map((section, index) => {
          switch (section.template) {
            case "image":
              return <FullWidthImage key={index} alt={section.alt} src={section.image} />
            case "text":
              return <PlainHtml key={index} html={remark().use(html).processSync(section.content).toString()} />
            default:
              throw new Error(`Unknown section template \`${section.template}\``)
          }
        })}
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
        sections {
          template
          image
          alt
          content
        }
      }
    }
  }
`
