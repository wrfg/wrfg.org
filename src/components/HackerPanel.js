import React, { useContext } from 'react'

import { EnvironmentContext } from '@/config'

import { ReadableContainer } from './parts'
import { Radio } from './forms'

const HackerPanel = () => {
  const { environment, set } = useContext(EnvironmentContext)

  return (
    <ReadableContainer>
      <h1>Hacker!</h1>
      <p>Press <kbd>Esc</kbd> three times to return to normal mode.</p>
      <Radio
        label='Stripe keys'
        name='stripeMode'
        presentation={Radio}
        options={[{ label: 'Test', value: 'TEST' }, { label: 'Live', value: 'LIVE' }]}
        value={environment.stripeMode}
        onChange={(value) => set('stripeMode', value)}
      />
    </ReadableContainer>
  )
}

export default HackerPanel