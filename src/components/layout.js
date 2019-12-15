import React from "react"

import { Link } from "gatsby"

import { Global, css } from "@emotion/core"

import { ReadableContainer, Section } from "./parts.js"

const NavLink = ({ children, ...props }) => {
  return (
    <Link {...props} css={css`
      display: inline-block;
      vertical-align: top;
      margin: 0.6em;
    `}>
      {children}
    </Link>
  )
}

export default ({ children }) => (
  <>
    <Global
      styles={css`
        body {
          margin: 0;
        }

        *, *:before, *:after {
          -moz-box-sizing: border-box;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
        }
      `}
    />
    <Section>
      <ReadableContainer>
        <Link to="/">
          <img
            src="/images/logo.gif"
            alt="WRFG"
            css={css`
              height: 1.6em;
              margin-top: 0.3em;
              margin-right: 0.6em;
            `}
          />
        </Link>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/schedule">Schedule</NavLink>
      </ReadableContainer>
    </Section>
    <ReadableContainer>
      {children}
    </ReadableContainer>
  </>
)
