import React from "react"

import { Link } from 'gatsby'

import { css } from "@emotion/core"

import { ReadableContainer, Stack } from '@/components/parts'

import { yellow, red, blue } from '@/components/colors'

const Logoture = () => {
  return (
    <div css={css`
      padding: 0.1em 1em 0.5em;
      background-color: ${yellow};
    `}>
      <div css={css`
        border: 1px solid black;
        margin: 1em 0.0em 0.5em;
        padding: 0.5em;
        text-align: center;
      `}>
        <div css={css`
          border: 1px solid black;
          padding: 2em;
        `}>
          <p css={css`
            color: white;
            font-family: sans-serif;
            letter-spacing: 0.5em;
            font-weight: bold;
          `}>• P • U • R • E •</p>
          <h1
            css={css`
              font-size: 6em;
              letter-spacing: -0.10em;
              color: ${red};
              text-shadow: 0.03em 0 0 white, -0.03em 0.03em 0 ${blue};
            `}
          >
            WRFG
          </h1>
          <p css={css`
            color: ${blue};
            font-size: 1.5em;
            font-weight: bold;
          `}>Natural Freshness</p>
        </div>
      </div>
      <p css={css`text-align: right`}>Net WT. 16 OZ.</p>
    </div>

  )
}

export default () => {
  return (
    <ReadableContainer>
      <Stack>
        <Link to="/">Back</Link>
        <Stack gap={1}>
          <Logoture />
          <div>Baking soda container</div>
        </Stack>
      </Stack>
    </ReadableContainer>
  )
}