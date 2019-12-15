import React from "react"

import { css } from "@emotion/core"

export const ReadableContainer = ({ children }) => {
  return (
    <div
      css={css`
        margin: 0 auto;
        max-width: 740px;
        padding: 0 10px;
        width: 100%;
      `}
    >
      {children}
    </div>
  )
}

export const Section = ({ children }) => {
  return (
    <div
      css={css`
        border-bottom: 1px solid #ccc;
      `}
    >
      {children}
    </div>
  )
}