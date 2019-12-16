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
        padding: 0.3em 0;
        border-bottom: 1px solid #ccc;
      `}
    >
      {children}
    </div>
  )
}

export const Clear = ({ children }) => {
  return (
    <div
      css={css`
        overflow: auto;
        width: 100%;
      `}
    >
      {children}
    </div>
  )
}

export const Left = ({ children }) => {
  return (
    <div
      css={css`
        float: left;
      `}
    >
      {children}
    </div>
  )
}

export const Right = ({ children }) => {
  return (
    <div
      css={css`
        float: right;
      `}
    >
      {children}
    </div>
  )
}
