import React, { useRef, useState, useEffect, useContext } from "react"

import { Link } from "gatsby"

import { css } from "@emotion/core"

import Time from "@/components/time.js"
import { yellow } from "@/components/colors.js"

import { useShows, zeitgeist } from "@/models/show.js"

import { Context as PersistentPlayerContext } from './persistent-player.js'

const PulsingRedCircle = () => {
  return (
    <span
      css={css`
        @keyframes pulsingAnimation {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        color: ${yellow};
        opacity: 1;
        animation: pulsingAnimation 2s infinite;
      `}
    >
      ●
    </span>
  )
}

const Piece = ({ children }) => {
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

const streamUrl = 'http://streaming.wrfg.org/'

const useStreamPlayer = (streamUrl, setState) => {
  const audioElementRef = useRef(null)

  const onPlay = () => {
    audioElementRef.current.currentTime = 0
    setState('playing')
  }

  const onPause = () => {
    setState('paused')
  }

  const player = {
    play: () => audioElementRef.current.play(),
    pause: () => {},
    element: (
      <audio preload="none" ref={audioElementRef} onPlay={() => onPlay()} onPause={() => onPause()}>
        controls
        <source src={streamUrl} type="audio/mpeg" />
        <track kind="captions" />
      </audio>
    ),
  }

  return player
}

const Player = () => {
  const shows = useShows()
  const [ now ] = zeitgeist(shows)

  const { register, play, pause, state, setState } = useContext(PersistentPlayerContext)
  const player = useStreamPlayer(streamUrl, setState)

  useEffect(() => {
    register('stream', player)
  }, [])

  return (
    <>
      <Piece>
        <button
          onClick={() => state === 'paused' ? play() : pause()}
          css={css`border: none; background: transparent; width: 1.6em; height: 1.6em; text-align: center; padding: 0;`}
        >
          {state === "playing" ? "◼️" : "▶︎"}
        </button>
      </Piece>
      <Piece>LIVE NOW <PulsingRedCircle /></Piece>
      {now && (
        <Piece>
          <Link to={now.show.slug}>{now.show.title}</Link> 'til <Time value={now.airshift.end} />
        </Piece>
      )}
    </>
  )
}

export default Player
