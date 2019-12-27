import React from 'react'

import { Wrapper as PersistentPlayerWrapper } from '@/client/persistent-player'

export const wrapPageElement = ({ element, props }) => {
  return <PersistentPlayerWrapper>
    {element}
  </PersistentPlayerWrapper>
}
