import React from 'react'

import { css } from '@emotion/core'

const PlayPause = ({ play, pause, state }) => {
  return (
    <button
      onClick={() => state === 'paused' ? play() : pause()}
      css={css`
        border: none;
        background: transparent;
        padding: 0;

        & > img {
          width: 2.8em;
          height: 2.8em;
          vertical-align: middle;
        }
      `}
    >
      {state === 'playing' ? (
        <img src="/icons/pause-fill.svg" alt="Pause" />
      ) : (
        <img src="/icons/play-fill.svg" alt="Play" />
      )}
    </button>
  )
}

export default PlayPause
