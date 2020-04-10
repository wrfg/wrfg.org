import React from 'react'

import { css } from '@emotion/core'

const PlayPause = ({ play, pause, state }) => {
  return (
    <button
      onClick={() => state === 'paused' ? play() : pause()}
      css={css`border: none; background: transparent; width: 1.6em; height: 1.6em; text-align: center; padding: 0;`}
    >
      {state === 'playing' ? '◼️' : '▶︎'}
    </button>
  )
}

export default PlayPause
