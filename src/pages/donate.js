import React, { useContext, useState, useEffect, useRef } from "react"

import { Link, graphql } from "gatsby"
import { loadStripe } from "@stripe/stripe-js"

import Layout from "@/components/layout.js"
import { Form, Input, Radio, Submit } from "@/components/forms.js"
import config from "@/config.js"

const url = (path) => (new URL(path, document.URL)).href

const registry = (frequency, amount) => {
  if (frequency === "ONCE") {
    const sku = {
      "1000": config.stripe.skus.donate1000,
      "2000": config.stripe.skus.donate2000,
      "5000": config.stripe.skus.donate5000,
    }[amount]

    if (!sku) {
      throw new Error(`No sku found for one-time donation of amount \`${amount}\``)
    }

    return {
      sku: sku,
      quantity: 1
    }
  }

  if (frequency === "MONTHLY") {
    const plan = {
      "1000": config.stripe.plans.monthly1000,
      "2000": config.stripe.plans.monthly2000,
      "5000": config.stripe.plans.monthly5000,
    }[amount]

    if (!plan) {
      throw new Error(`No plan found for monthly donation of amount \`${amount}\``)
    }

    return {
      plan: plan,
      quantity: 1
    }
  }

  throw new Error(`Unknown frequency \`${frequency}\``)
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
      items: [registry(values.frequency, values.amount)],
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
        <Input
          name="amount"
          label="Select amount"
          presentation={Radio}
          options={[
            {value: "1000", label: "$10"},
            {value: "2000", label: "$20"},
            {value: "5000", label: "$50"},
          ]}
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
