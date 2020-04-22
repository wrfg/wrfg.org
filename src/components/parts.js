import React from "react"

import { css } from "@emotion/core"

export const ReadableContainer = ({ children }) => {
  return (
    <div
      css={css`
        margin: 0 auto;
        max-width: 46em;
        padding: 0 1em;
        width: 100%;
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

export const FullWidthImage = ({ alt, src }) => {
  return <img css={css`width: 100%;`} alt={alt} src={src} />
}

export const PlainHtml = ({ html }) => {
  return <div css={css`
    h1, h2, h3, h4, h5, h6, p, ol, ul {
      margin: 0 0 1em;
    }

    p:only-child {
      margin-bottom: 0;
    }
  `} dangerouslySetInnerHTML={{ __html: html }}></div>
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