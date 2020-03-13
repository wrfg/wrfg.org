import React from "react"
import { graphql } from "gatsby"

import Layout from "@/components/layout.js"

import { css } from "@emotion/core"

import remark from "remark"
import html from "remark-html"

export default ({ data }) => {
  const page = data.markdownRemark
  const sections = page.frontmatter.sections

  return (
    <Layout>
      {sections && sections.map((section, index) => {
        switch (section.template) {
          case "image":
            return <img key={index} alt={section.alt} src={section.image} css={css`width: 100%; margin: 1em 0`} />
          case "text":
            return <div key={index} dangerouslySetInnerHTML={{ __html: remark().use(html).processSync(section.content).toString() }}></div>
          default:
            throw new Error(`Unknown section template \`${section.template}\``)
        }
      })}
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
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
