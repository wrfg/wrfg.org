import React, { useState, useEffect, useRef } from "react"

import { Link, graphql } from "gatsby"
import { loadStripe } from "@stripe/stripe-js"

import Layout from "@/components/layout.js"
import config from "@/config.js"

const url = (path) => (new URL(path, document.URL)).href

export default ({ data }) => {
  const [{ isLoading }, setState] = useState({ isLoading: true });
  const stripeRef = useRef(null);
  const { current: stripe } = stripeRef

  useEffect(() => {
    loadStripe(config.stripe.publishableApiKey).then((value) => {
      stripeRef.current = value
      setState((s) => {
        return { ...s, isLoading: false }
      })
    })
  }, [])

  const openCheckout = () => {
    if (isLoading) {
      return
    }

    stripe.redirectToCheckout({
      items: [
        {sku: config.stripe.skus.donate2000, quantity: 1},
      ],
      successUrl: url("/thank-you"),
      cancelUrl: url("/donate"),
    })
  }

  return (
    <Layout title="Donate">
      <h2>Donate</h2>
      <button disabled={isLoading} onClick={() => openCheckout()}>Donate $20 one-time</button>
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
