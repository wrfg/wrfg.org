import React from "react"

import { css } from "@emotion/core"

import { nearBlack, lightGrey, grey, darkGrey } from './colors'

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

export const Stack = ({ gap = 2, children }) => {
  return <div
    css={css`
      display: grid;
      grid-gap: ${gap / 2}em;
    `}
  >{children}</div>
}

export const Spread = ({ gap = 2, splits = [], children }) => {
  return (
    <div css={css`
      display: grid;
      grid-template-columns: ${splits.map((split) => `${split}fr`).join(' ')};
      grid-gap: ${gap / 2}em;
    `}>
      {children}
    </div>
  )
}

export const VerticallyCenter = ({ children }) => {
  return (
    <div css={css`
      display: flex;
      flex-direction: column;
      justify-content: center;
    `}>
      {children}
    </div>
  )
}

export const FullWidthImage = ({ alt, src }) => {
  return <img css={css`width: 100%;`} alt={alt} src={src} />
}

export const hoverStyles = css`
  &:hover:not([disabled]), &:focus:not([disabled]) {
    box-shadow: 0 0 0.25em 0 ${nearBlack};
    cursor: pointer;
    outline: 0;
  }
`

export const Button = ({ type, onClick, children, disabled = false, behavior = 'button' }) => {
  const base = css`
    padding: calc(0.5rem - 2px) calc(1rem - 2px);
    border-width: 1px;
    border-style: solid;
    font-size: .75rem;
    border-radius: 0.25rem;
    ${hoverStyles}

    &[disabled] {
      cursor: wait;
    }
  `

  const styles = {
    primary: css`
      ${base};
      color: white;
      background-color: ${nearBlack};
      border-color: black;

      &:hover:not([disabled]), &:active:not([disabled]) {
        background-color: ${darkGrey};
      }

      &[disabled] {
        color: ${grey};
        background-color: ${darkGrey};
        border-color: ${darkGrey};
      }
    `,
    secondary: css`
      ${base};
      color: black;
      background-color: ${lightGrey};
      border-color: ${grey};

      &:hover:not([disabled]), &:active:not([disabled]) {
      }

      &[disabled] {
        color: ${darkGrey};
      }
    `,
    tertiary: css`
      ${base};
      color: black;
      background-color: white;
      border-color: ${grey};

      &:hover:not([disabled]), &:active:not([disabled]) {
      }

      &[disabled] {
        color: ${darkGrey};
      }
    `,
  }[type]

  return <button css={styles} type={behavior} onClick={onClick} disabled={disabled}>{children}</button>
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