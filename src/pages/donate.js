import React, { useState, useEffect, useRef } from 'react'

import { Link } from 'gatsby'
import { loadStripe } from '@stripe/stripe-js'

import { trackCustomEvent } from 'gatsby-plugin-google-analytics'

import DevTip from '@/components/DevTip'
import Layout from '@/components/layout.js'
import { Stack } from '@/components/parts'
import { Form, Input, Buttons, Dropdown, Dollars, Submit, Context as FormContext } from '@/components/forms.js'
import { useConfig } from '@/config.js'

import Show from "@/models/show.js"

const url = (path) => (new URL(path, document.URL)).href
const endpoint = (url, params) => {
  return Object.entries(params).reduce((accumulation, [key, value]) => {
    accumulation.searchParams.set(key, value);
    return accumulation;
  }, new URL(url));
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

  const openCheckout = async (values) => {
    if (isLoading) {
      return
    }

    const amount = values.amount === 'other' ? values.customAmount : values.amount;
    trackCustomEvent({ category: 'Donation', action: 'Submit', label: values.frequency === 'ONCE' ? 'One time' : 'Monthly', value: amount })
    trackCustomEvent({ category: 'Donation', action: 'In support of', label: values.inSupportOf })

    const response = await fetch(
      endpoint('https://us-central1-lively-wave-274720.cloudfunctions.net/function-1', {
        amount: amount,
        successUrl: url('/thank-you'),
        cancelUrl: url('/donate'),
        frequency: values.frequency,
      })
    ).then((response) => response.json())

    return stripe.redirectToCheckout({ sessionId: response.id })
  }

  return (
    <Layout title='Donate'>
      <Stack>
        <h2>Donate</h2>
        <Form initialValues={{ frequency: 'ONCE', amount: '2000', inSupportOf: 'station', customAmount: 4000 }} onSubmit={openCheckout}>
          <Input
            name='frequency'
            label='Select donation frequency'
            presentation={Buttons}
            options={[{value: 'ONCE', label: 'One time'}, {value: 'MONTHLY', label: 'Monthly'}]}
          />
          <FormContext.Consumer>{({ values }) => {
            return (
              <Input
                name='amount'
                label='Select amount'
                presentation={Buttons}
                options={[
                  {value: '1000', label: '$10'},
                  {value: '2000', label: '$20'},
                  {value: '5000', label: '$50'},
                  {value: '8930', label: '$89.30'},
                  {value: '12000', label: '$120'},
                  {value: '25000', label: '$250'},
                  {value: '50000', label: '$500'},
                  {value: 'other', label: 'Other', disabled: values.frequency !== 'ONCE'},
                ]}
              />
            )
          }}</FormContext.Consumer>
          <FormContext.Consumer>{({ values }) => {
            return (
              values.amount === 'other' && (<Input
                name='customAmount'
                label='Custom amount'
                presentation={Dollars}
              />)
            )
          }}</FormContext.Consumer>
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
          <div>
            <FormContext.Consumer>{({ values }) => {
              const recurringAndOther = values.frequency !== 'ONCE' && values.amount === 'other'
              const otherAndEmpty = values.amount === 'other' && !values.customAmount
              const disabled = isLoading || recurringAndOther || otherAndEmpty

              return <Submit disabled={disabled}>Donate with credit card</Submit>
            }}</FormContext.Consumer>
          </div>
        </Form>
        <div>
          <p>Interested in donating your time or skills? Learn how you can <Link to='/support'>support the station</Link>.</p>
          <p>You can also donate via phone at <a href="tel:+14045233471">(404) 523-3471</a>, or by mailing a check to <Link to="/about">our address</Link>.</p>
        </div>
        <DevTip visible={stripeConfig.mode === 'TEST'}>
          You can use credit card <code>4242 4242 4242 4242</code> with any future expiration and any 3-digit CVV to submit the donation.
        </DevTip>
      </Stack>
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
