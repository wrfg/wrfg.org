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

export const Stack = ({ children }) => {
  return <div
    css={css`
      display: grid;
      grid-gap: 1em;
    `}
  >{children}</div>
}

export const FullWidthImage = ({ src }) => {
  return <img css={css`width: 100%;`} src={src} />
}

// at and below this value, a viewport is considered "small"
const small = 575

export const hideSmall = css`@media (max-width: ${small}px) {display: none;}`
export const showSmall = css`@media (min-width: ${small + 1}px) {display: none;}`

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

export const ExternalLink = ({ children, ...props }) => {
  if (props.hasOwnProperty('to')) {
    props.href = props.to
    delete props.to
  }

  return (
    <a {...props} target='_blank' rel='noopener nofollow'>
      {children}
    </a>
  )
}