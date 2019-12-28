import React, { useRef, useMemo, useCallback } from "react"

import { Link } from "gatsby"

import { css } from "@emotion/core"

import Time from "@/components/time.js"
import { yellow } from "@/components/colors.js"

import { useShows, zeitgeist } from "@/models/show.js"

import { Context as PersistentPlayerContext, usePersistentPlayer } from './persistent-player.js'
import PlayPause from './play-pause.js'

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
  const audioElementRef = useRef(null)
  const onPlay = useRef(() => {})
  const onPause = useRef(() => {})
  const element = useMemo(() => {
    return (
      <audio preload="none" ref={audioElementRef} onPlay={() => onPlay.current()} onPause={() => onPause.current()}>
        controls
        <source src={streamUrl} type="audio/mpeg" />
        <track kind="captions" />
      </audio>
    )
  }, [])

  const {
    state,
    setState,
    play,
    pause,
  } = usePersistentPlayer({
    id: id,
    play: useCallback(() => audioElementRef.current.play(), []),
    pause: useCallback(() => audioElementRef.current.pause(), []),
    element: element,
  })

  onPlay.current = () => {
    audioElementRef.current.currentTime = 0
    setState('playing')
  }

  onPause.current = () => {
    setState('paused')
  }

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
        <PlayPause play={play} pause={pause} state={state} />
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
