import React, { useContext } from 'react'

import { EnvironmentContext } from '@/config'

import { ReadableContainer, Spacer } from './parts'
import { Radio } from './forms'

const HackerPanel = ({ exit }) => {
  const { environment, set, reset } = useContext(EnvironmentContext)

  return (
    <ReadableContainer>
      <h1>Hacker!</h1>
      <button onClick={() => exit()}>Exit</button>
      <Spacer size="sm" />
      <Radio
        label='Stripe keys'
        name='stripeMode'
        presentation={Radio}
        options={[{ label: 'Test', value: 'TEST' }, { label: 'Live', value: 'LIVE' }]}
        value={environment.stripeMode}
        onChange={(value) => set('stripeMode', value)}
      />
      <Spacer size="sm" />
      <button onClick={() => reset()}>Reset environment</button>
    </ReadableContainer>
  )
}

export default HackerPanel