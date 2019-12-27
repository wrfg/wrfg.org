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

const useStreamPlayer = (id, streamUrl) => {
  const [ state, setState ] = useState('paused')
  const { register, seize } = useContext(PersistentPlayerContext)

  const audioElementRef = useRef(null)
  const play = () => audioElementRef.current.play()
  const pause = () => audioElementRef.current.pause()

  const onPlay = useRef(null)
  onPlay.current = () => {
    seize(id)
    audioElementRef.current.currentTime = 0
    setState('playing')
  }

  const onPause = useRef(null)
  onPause.current = () => {
    setState('paused')
  }

  useEffect(() => {
    register(id, {
      pause: pause,
      element: (
        <audio preload="none" ref={audioElementRef} onPlay={() => onPlay.current()} onPause={() => onPause.current()}>
          controls
          <source src={streamUrl} type="audio/mpeg" />
          <track kind="captions" />
        </audio>
      ),
    })
  }, [id, register, streamUrl])

  return {
    play: play,
    pause: pause,
    state: state,
  }
}

const Player = ({ id }) => {
  const shows = useShows()
  const [ now ] = zeitgeist(shows)

  const {
    play,
    pause,
    state,
  } = useStreamPlayer(id, streamUrl)

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
