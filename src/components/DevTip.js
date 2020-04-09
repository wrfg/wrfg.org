import React from 'react'

import { css } from '@emotion/core'

const DevTip = ({ visible, children }) => {
  if (!visible) {
    return null
  }

  return <div css={css`padding: 1em; border: 1px solid pink`}>
    <div><small>This is only displayed in testing mode.</small></div>
    {children}
  </div>
}

export default DevTip