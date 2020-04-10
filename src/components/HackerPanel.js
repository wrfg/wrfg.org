import React, { useContext } from 'react'

import { EnvironmentContext } from '@/config'

import { ReadableContainer, Spacer } from './parts'
import { Radio } from './forms'

const HackerPanel = ({ exit }) => {
  const { environment, set, reset } = useContext(EnvironmentContext)

  return (
    <ReadableContainer>
      <button onClick={() => exit()}>Exit quietly</button>
      <h1>Hacker!</h1>
      <Spacer size="lg" />
      <h3>Internal settings</h3>
      <Spacer size="md" />
      <Radio
        label='Donations mode'
        name='stripeMode'
        presentation={Radio}
        options={[
          { value: 'LIVE', label: 'Live - Charges you, like for real (default)' },
          { value: 'TEST', label: 'Test - Supports fake credit cards like *4242, and doesn\'t actually charge you' },
        ]}
        value={environment.stripeMode}
        onChange={(value) => set('stripeMode', value)}
      />
      <Spacer size="md" />
      <p>Changes are automatically saved.</p>
      <Spacer size="lg" />
      <h3>Nuclear option</h3>
      <Spacer size="md" />
      <button onClick={() => reset()}>Reset all internal settings to their defaults</button>
    </ReadableContainer>
  )
}

export default HackerPanel