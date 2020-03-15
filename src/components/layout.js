import React from "react"

import { Link } from "gatsby"

import { Global, css } from "@emotion/core"

import { Helmet } from "react-helmet-async"

import { ReadableContainer, Section, Clear, Left, Right } from "./parts.js"

import { useStreamPlayer } from "@/client/player.js"
import { Context as PersistentPlayerContext } from "@/client/persistent-player.js"
import PlayPause from '@/client/play-pause.js'

const NavLink = ({ children, ...props }) => {
  return (
    <Link {...props} css={css`
      display: inline-block;
      vertical-align: top;
      padding: 0.3em;
      padding-top: 0.7em;
    `}>
      {children}
    </Link>
  )
}

const ExternalLink = ({ children, ...props }) => {
  if (props.hasOwnProperty("to")) {
    props.href = props.to
    delete props.to
  }

  return (
    <a {...props} target="_blank" rel="noopener nofollow">
      {children}
    </a>
  )
}

const SocialImageLink = ({ to, src, alt }) => {
  return (
    <ExternalLink
      to={to}
      css={css`
        display: inline-block;
        padding: 0.3em;
        padding-top: 0.7em;
      `}>
      <img
        src={src}
        alt={alt}
        css={css`
         height: 1em;
         vertical-align: middle;
        `}
      />
    </ExternalLink>
  )
}

export default ({ children }) => {
  useStreamPlayer('stream')

  return (
    <>
      <Helmet
        title={`WRFG`}
        meta={[
          {name: 'charset', content: 'utf-8'},
          {name: 'apple-mobile-web-app-title', content: 'WRFG'},
          //{name: 'apple-mobile-web-app-capable', content: 'yes'},// until navigation can be done without changing the url, setting this is a subpar experience
        ]}
        link={[
          {rel: 'apple-touch-startup-image', href: '/images/logo-disk-white.png'},
          {rel: 'apple-touch-icon', href: '/images/logo-disk-white.png'},
        ]}
      />
      <Global
        styles={css`
          body {
            margin: 0;
          }

          *, *:before, *:after {
            -moz-box-sizing: border-box;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            color: black;
            line-height: 1.4em;
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
                    height: 2.6em;
                    margin-right: 0.6em;
                  `}
                />
              </Link>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/schedule">Schedule</NavLink>
              <NavLink to="/support">Support</NavLink>
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
              <SocialImageLink
                to="https://www.mixcloud.com/WRFG/"
                src="/images/mixcloud/BlackOnTransparent.png"
                alt="Mixcloud"
              />
            </Right>
          </Clear>
        </ReadableContainer>
      </Section>
      <Section>
        <ReadableContainer>
          <PersistentPlayerContext.Consumer>
            {({ registry, order, active, play, pause }) => {
              return order.map((id) => {
                if (!registry[id]) {
                  return null
                }
                const { label } = registry[id]
                return <div key={id}>
                  <PlayPause
                    play={() => play(id)}
                    pause={() => pause(id)}
                    state={active === id ? 'playing' : 'paused'}
                  />{' '}
                  {label || id}
                </div>
              })
            }}
          </PersistentPlayerContext.Consumer>
        </ReadableContainer>
      </Section>
      <ReadableContainer>
        {children}
      </ReadableContainer>
      <div>
        <br />
        <br />
      </div>
    </>
  )
}
