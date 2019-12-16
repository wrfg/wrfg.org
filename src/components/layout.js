import React from "react"

import { Link } from "gatsby"

import { Global, css } from "@emotion/core"

import { ReadableContainer, Section, Clear, Left, Right } from "./parts.js"

import { LoadablePlayer } from "../client/player.js"

const NavLink = ({ children, ...props }) => {
  return (
    <Link {...props} css={css`
      display: inline-block;
      vertical-align: top;
      padding: 0.3em;
    `}>
      {children}
    </Link>
  )
}

const SocialImageLink = ({ to, src, alt }) => {
  return (
    <Link
      to={to}
      css={css`
        display: inline-block;
        padding: 0.3em;
      `}>
      <img
        src={src}
        alt={alt}
        css={css`
         height: 1em;
         vertical-align: middle;
        `}
      />
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
        <Clear>
          <Left>
            <Link to="/">
              <img
                src="/images/logo.gif"
                alt="WRFG"
                css={css`
                  height: 1.6em;
                  margin-right: 0.6em;
                `}
              />
            </Link>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/shows">Shows</NavLink>
          </Left>
          <Right>
            <SocialImageLink
              to="https://www.instagram.com/wrfgatlanta/"
              src="/images/instagram/glyph-logo_May2016.png"
              alt="Instagram"
            />
            <SocialImageLink
              to="https://www.facebook.com/pg/WRFG89.3/"
              src="/images/facebook/f_logo_RGB-Black_100.png"
              alt="Facebook"
            />
          </Right>
        </Clear>
      </ReadableContainer>
    </Section>
    <Section>
      <ReadableContainer>
        <LoadablePlayer />
      </ReadableContainer>
    </Section>
    <ReadableContainer>
      {children}
    </ReadableContainer>
  </>
)
