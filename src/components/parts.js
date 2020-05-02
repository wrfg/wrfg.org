import React from "react"

import { Link } from 'gatsby'
import { css } from "@emotion/core"

import { nearBlack, lightGrey, grey, darkGrey } from './colors'

export const Clear = ({ children }) => {
  return (
    <div css={css`
      clear: both;
    `}>
      {children}
    </div>
  )
}

export const Right = ({ width = 1, children }) => {
  return (
    <div css={css`
      float: right;
      width ${width * 100}%;
    `}>
      {children}
    </div>
  )
}

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

export const Inline = ({ baseCss, gap = 2, children }) => {
  return (
    <div css={css`
      ${baseCss};
      display: flex;

      & > *:not(:first-of-type) {
        margin-left: ${gap/2}em;
      }
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

export const UnadornedLink = ({ ...props}) => {
  return <Link {...props} css={css`text-decoration: none;`} />
}

export const Button = ({ type, onClick, children, disabled = false, behavior = 'button' }) => {
  const base = css`
    padding: 0.75em 1.5em;
    border-width: 1px;
    border-style: solid;
    font-size: .75em;
    border-radius: 0.25em;
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

export const mediaSmall = (rules) => {
  return css`
    @media (max-width: ${small}px) {
      ${rules};
    }
  `
}

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