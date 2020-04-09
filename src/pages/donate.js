import React, { useContext, useState, useEffect, useRef } from "react"

import { Link, graphql } from "gatsby"
import { loadStripe } from "@stripe/stripe-js"

import Layout from "@/components/layout.js"
import { Form, Input, Radio, Submit } from "@/components/forms.js"
import config from "@/config.js"

const url = (path) => (new URL(path, document.URL)).href

const registry = (frequency) => {
  switch (frequency) {
    case "ONCE":
      return { sku: config.stripe.skus.donate2000, quantity: 1 }
    case "MONTHLY":
      return { plan: config.stripe.plans.monthly2000, quantity: 1 }
    default:
      throw new Error(`Unknown frequency \`${frequency}\``);
  }
}

export default () => {
  const [{ isLoading }, setState] = useState({ isLoading: true })
  const stripeRef = useRef(null)
  const { current: stripe } = stripeRef

  useEffect(() => {
    loadStripe(config.stripe.publishableApiKey).then((value) => {
      stripeRef.current = value
      setState((s) => {
        return { ...s, isLoading: false }
      })
    })
  }, [])

  const openCheckout = (values) => {
    if (isLoading) {
      return
    }

    stripe.redirectToCheckout({
      items: [registry(values.frequency)],
      successUrl: url("/thank-you"),
      cancelUrl: url("/donate"),
    })
  }

  return (
    <Layout title="Donate">
      <h2>Donate</h2>
      <Form initialValues={{ frequency: "ONCE" }} onSubmit={openCheckout}>
        <Input
          name="frequency"
          label="Select donation frequency"
          presentation={Radio}
          options={[{value: "ONCE", label: "One time"}, {value: "MONTHLY", label: "Monthly"}]}
        />
        <div>
          <Submit disabled={isLoading}>Donate with credit card</Submit>
        </div>
      </Form>
      <p>Interested in donating your time or skills? Learn how you can <Link to="/support">support the station</Link>.</p>
    </Layout>
  )
}

export const query = graphql`
  {
    allMarkdownRemark(filter: {fields: {kind: {eq: "shows"}}}) {
      edges {
        node {
          id
          frontmatter {
            title
            airshifts {
              start
              duration
              day
            }
          }
          fields {
            slug
          }
        }
      }
    }
  }
`
