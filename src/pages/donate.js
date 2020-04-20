import React, { useState, useEffect, useRef } from 'react'

import { Link } from 'gatsby'
import { loadStripe } from '@stripe/stripe-js'

import { trackCustomEvent } from 'gatsby-plugin-google-analytics'

import DevTip from '@/components/DevTip'
import Layout from '@/components/layout.js'
import { Form, Input, Radio, Dropdown, Submit } from '@/components/forms.js'
import { useConfig } from '@/config.js'

import Show from "@/models/show.js"

const url = (path) => (new URL(path, document.URL)).href

const registry = (stripeConfig, frequency, amount) => {
  if (frequency === 'ONCE') {
    const sku = {
      '1000': stripeConfig.skus.donate1000,
      '2000': stripeConfig.skus.donate2000,
      '5000': stripeConfig.skus.donate5000,
      '8930': stripeConfig.skus.donate8930,
      '12000': stripeConfig.skus.donate12000,
      '25000': stripeConfig.skus.donate25000,
      '50000': stripeConfig.skus.donate50000,
    }[amount]

    if (!sku) {
      throw new Error(`No sku found for one-time donation of amount \`${amount}\``)
    }

    return {
      sku: sku,
      quantity: 1
    }
  }

  if (frequency === 'MONTHLY') {
    const plan = {
      '1000': stripeConfig.plans.monthly1000,
      '2000': stripeConfig.plans.monthly2000,
      '5000': stripeConfig.plans.monthly5000,
      '8930': stripeConfig.plans.monthly8930,
      '12000': stripeConfig.plans.monthly12000,
      '25000': stripeConfig.plans.monthly25000,
      '50000': stripeConfig.plans.monthly50000,
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

export default ({ data }) => {
  const shows = data.allMarkdownRemark.edges.map((edge) => edge.node).map(Show.factory)

  const [{ isLoading }, setState] = useState({ isLoading: true })
  const stripeRef = useRef(null)
  const { current: stripe } = stripeRef
  const { stripe: stripeConfig } = useConfig()

  useEffect(() => {
    loadStripe(stripeConfig.publishableApiKey).then((value) => {
      stripeRef.current = value
      setState((s) => {
        return { ...s, isLoading: false }
      })
    })
  }, [stripeConfig.publishableApiKey])

  const openCheckout = (values) => {
    if (isLoading) {
      return
    }

    trackCustomEvent({category: 'Donation', action: 'Submit', label: values.frequency === 'ONCE' ? 'One time' : 'Monthly', value: parseInt(values.amount, 10)})
    trackCustomEvent({category: 'Donation', action: 'In support of', label: values.inSupportOf})
    stripe.redirectToCheckout({
      items: [registry(stripeConfig, values.frequency, values.amount)],
      successUrl: url('/thank-you'),
      cancelUrl: url('/donate'),
    })
  }

  return (
    <Layout title='Donate'>
      <h2>Donate</h2>
      <Form initialValues={{ frequency: 'ONCE', amount: '2000', inSupportOf: 'station' }} onSubmit={openCheckout}>
        <Input
          name='frequency'
          label='Select donation frequency'
          presentation={Radio}
          options={[{value: 'ONCE', label: 'One time'}, {value: 'MONTHLY', label: 'Monthly'}]}
        />
        <Input
          name='amount'
          label='Select amount'
          presentation={Radio}
          options={[
            {value: '1000', label: '$10'},
            {value: '2000', label: '$20'},
            {value: '5000', label: '$50'},
            {value: '8930', label: '$89.30'},
            {value: '12000', label: '$120'},
            {value: '25000', label: '$250'},
            {value: '50000', label: '$500'},
          ]}
        />
        <Input
          name='inSupportOf'
          label='In support of'
          presentation={Dropdown}
          options={[
            {value: 'station', label: 'The station as a whole'},
            ...shows.map((show) => {
              return {
                value: show.title,
                label: show.title,
              }
            }),
          ]}
        />
        <DevTip visible={stripeConfig.mode === 'TEST'}>
          You can use credit card <code>4242 4242 4242 4242</code> with any future expiration and any 3-digit CVV to submit the donation.
        </DevTip>
        <div>
          <Submit disabled={isLoading}>Donate with credit card</Submit>
        </div>
      </Form>
      <p>Interested in donating your time or skills? Learn how you can <Link to='/support'>support the station</Link>.</p>
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
          }
          fields {
            slug
          }
        }
      }
    }
  }
`
