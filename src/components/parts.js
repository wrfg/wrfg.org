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

export const Piece = ({ children }) => {
  return (
    <div
      css={css`
        display: inline-block;
        margin-left: 0.3em;
        margin-right: 0.3em;

        &:first-of-type {
          margin-left: 0em;
        }

        &:last-of-type {
          margin-right: 0em;
        }
      `}
    >
      {children}
    </div>
  )
}

export const Row = ({ baseCss, children }) => {
  return <div css={[baseCss, css`display: flex; align-items: center; flex-wrap: wrap;`]}>{children}</div>
}

export const Item = ({ baseCss, keep, order, children }) => {
  const contentJustification = {
    left: "flex-start",
    right: "flex-end",
  }[keep] || "center"

  return <div css={[baseCss, css`width: 0px; align-items: center; display: flex; justify-content: ${contentJustification}; order: ${order}; flex-grow: 1;`]}>{children}</div>
}

export const hideSmall = css`@media (max-width: 375px) {display: none;}`
export const showSmall = css`@media (min-width: 376px) {display: none;}`

export const Spacer = ({ size }) => {
  const multiplier = {
    sm: 1,
    md: 2,
    lg: 4,
    xl: 8,
  }[size]

  if (!multiplier) {
    throw new Error(`No such size ${size}`)
  }

  return (
    <div
      css={css`
        margin-bottom: calc(${multiplier} * 8px)
      `}
    />
  )
}