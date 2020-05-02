import React, { useState } from 'react'

import { Link } from 'gatsby'

import { Global, css } from '@emotion/core'

import { Helmet } from 'react-helmet-async'

import { ReadableContainer, ExternalLink, Inline, UnadornedLink, mediaSmall } from './parts'
import { lightGrey } from './colors'

import { useStreamPlayer } from '@/client/player'
import { Context as PersistentPlayerContext } from '@/client/persistent-player'
import PlayPause from '@/client/play-pause'

import HackerPanel from './HackerPanel'

const Section = ({ children }) => {
  return (
    <div
      css={css`
        padding: 1em 0;
        border-bottom: 1px solid ${lightGrey};
      `}
    >
      {children}
    </div>
  )
}

const Row = ({ baseCss = [], children }) => {
  return <div css={[css`display: flex; flex-wrap: wrap;`, ...baseCss]}>{children}</div>
}

const SocialImageLink = ({ to, src, alt }) => {
  return (
    <ExternalLink
      to={to}
      css={css`
        &:not(:first-of-type) {
          margin-left: 0.5em;
        }
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

const useSecretKnock = (openSesame) => {
  const [knocks, setKnocks] = useState([])
  const resetKnocks = () => setKnocks([])
  const thresholdInMilliseconds = 1000
  const meetsCriteria = ([thirdKnock, _, firstKnock]) => thirdKnock - firstKnock < thresholdInMilliseconds

  const knock = () => {
    const newKnocks = [new Date(), ...knocks].slice(0, 3)
    if (meetsCriteria(newKnocks)) {
      resetKnocks()
      openSesame()
    } else {
      setKnocks(newKnocks)
    }
  }

  return knock
}

export default ({ title, children }) => {
  useStreamPlayer('stream')

  const [mode, setMode] = useState('NORMAL')
  const knock = useSecretKnock(() => setMode(mode === 'HACKER' ? 'NORMAL' : 'HACKER'))

  const LogoItem = () => {
    return (
      <Link to='/' onClick={() => knock()}>
        <img
          src='/images/logo.gif'
          alt='WRFG'
          css={css`
            height: 3.5em;
          `}
        />
      </Link>
    )
  }

  return (
    <>
      <Helmet
        title={[title, 'WRFG'].filter((x) => !!x).join(' - ')}
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
          @font-face {
            font-family: "wrfg-serif";
            src: url("/images/librebaskerville/librebaskerville-regular.ttf");
          }

          body {
            margin: 0;
            font-size: 1.25em;
            ${mediaSmall(`
              font-size: 1em;
            `)}
          }


          *, *:before, *:after {
            -moz-box-sizing: border-box;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            color: inherit;
            border-spacing: 0;
          }

          h1, h2, h3, h4, h5, h6, p, ul, ol {
            margin: 0;
            line-height: 1.5em;
          }

          body {
            font-family: "wrfg-serif", Times;
          }

          h1, h2, h3, h4, h5, h6 {
            font-family: "wrfg-serif", Times;
          }

          select, button {
            font-family: "wrfg-serif", Times;
          }
        `}
      />
      {mode === 'HACKER'
        ? <HackerPanel exit={() => setMode('NORMAL')} />
        : (<>
          <Section>
            <ReadableContainer>
              <Row baseCss={[css`justify-content: center`]}><LogoItem /></Row>
              <Row baseCss={[css`justify-content: space-between`]}>
                <Inline>
                  <UnadornedLink to='/'>Home</UnadornedLink>
                  <UnadornedLink to='/schedule'>Schedule</UnadornedLink>
                  <UnadornedLink to='/donate'>Donate</UnadornedLink>
                  <UnadornedLink to='/about'>About</UnadornedLink>
                </Inline>
                <div>
                  <SocialImageLink
                    to='https://www.instagram.com/wrfgatlanta/'
                    src='/images/instagram/glyph-logo_May2016.png'
                    alt='Instagram'
                  />
                  <SocialImageLink
                    to='https://www.facebook.com/pg/WRFG89.3/'
                    src='/images/facebook/f_logo_RGB-Black_100.png'
                    alt='Facebook'
                  />
                  <SocialImageLink
                    to='https://www.mixcloud.com/WRFG/'
                    src='/images/mixcloud/BlackOnTransparent.png'
                    alt='Mixcloud'
                  />
                </div>
              </Row>
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
                    return <Inline key={id} baseCss={css`align-items: center;`}>
                      <div>
                        <PlayPause
                          play={() => play(id)}
                          pause={() => pause(id)}
                          state={active === id ? 'playing' : 'paused'}
                        />
                      </div>
                      {label || id}
                    </Inline>
                  })
                }}
              </PersistentPlayerContext.Consumer>
            </ReadableContainer>
          </Section>
          <ReadableContainer>
            <br />
            {children}
          </ReadableContainer>
          <div>
            <br />
            <br />
          </div>
        </>)
      }
    </>
  )
}
