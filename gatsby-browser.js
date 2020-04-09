import React from 'react'

import { Wrapper as PersistentPlayerWrapper } from '@/client/persistent-player'
import { EnvironmentWrapper } from '@/config'

export const wrapPageElement = ({ element, props }) => {
  return <EnvironmentWrapper>
    <PersistentPlayerWrapper>
      {element}
    </PersistentPlayerWrapper>
  </EnvironmentWrapper>
}
