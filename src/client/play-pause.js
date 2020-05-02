import React from 'react'

import { css } from '@emotion/core'

import { mediumGrey } from '@/components/colors'

const PlayPause = ({ play, pause, state }) => {
  return (
    <button
      onClick={() => state === 'paused' ? play() : pause()}
      css={css`
        border: none;
        background: transparent;
        padding: 0;
        cursor: pointer;

        & > img {
          width: 2.8em;
          height: 2.8em;
          vertical-align: middle;
        }

        &:hover {
        filter: drop-shadow(0 0 0.2em ${mediumGrey});
        }
      `}
    >
      {state === 'playing' ? (
        <img src="/icons/pause.svg" alt="Pause" />
      ) : (
        <img src="/icons/play-fill.svg" alt="Play" />
      )}
    </button>
  )
}

export default PlayPause
