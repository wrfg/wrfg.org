import React, { useContext } from 'react'

import { EnvironmentContext } from '@/config'

import { ReadableContainer, Stack } from './parts'
import { Radio } from './forms'

const HackerPanel = ({ exit }) => {
  const { environment, set, reset } = useContext(EnvironmentContext)

  return (
    <ReadableContainer>
      <Stack>
        <div>
          <button onClick={() => exit()}>Exit quietly</button>
        </div>
        <div>
          <h1>Hacker!</h1>
          <p>Changes are automatically saved.</p>
        </div>
        <div>
          <h3>Internal settings</h3>
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
        </div>
        <div>
          <h3>Nuclear option</h3>
          <button onClick={() => reset()}>Reset all internal settings to their defaults</button>
        </div>
      </Stack>
    </ReadableContainer>
  )
}

export default HackerPanel