import React, { useRef, useMemo, useCallback } from 'react'

import { Link } from 'gatsby'

import { css } from "@emotion/core"

import Time from '@/components/time'

import { useNow } from '@/now'

import { useShows, zeitgeist } from '@/models/show'

import { usePersistentPlayer } from './persistent-player'
import LivePulse from './live-pulse'

const Piece = ({ children }) => {
  return (
    <div
      css={css`
        display: inline-block;
        margin-left: 0.5em;
        margin-right: 0.5em;

        &:first-of-type {
          margin-left: 0;
        }

        &:last-of-type {
          margin-right: 0;
        }
      `}
    >
      {children}
    </div>
  )
}


const streamUrl = 'https://s2.radio.co/s2133c4bad/listen'
const useStreamPlayer = (id) => {
  const shows = useShows()
  const jetzt = useNow()
  const [ now ] = useMemo(() => zeitgeist(shows, jetzt), [shows, jetzt])

  const audioElementRef = useRef(null)
  const onPlay = useRef(() => {})
  const onPause = useRef(() => {})

  const {
    state,
    setState,
    play,
    pause,
  } = usePersistentPlayer({
    id: id,
    play: useCallback(() => audioElementRef.current.play(), []),
    pause: useCallback(() => audioElementRef.current.pause(), []),
    element: useMemo(() => {
      return (
        <audio preload='none' ref={audioElementRef} onPlay={() => onPlay.current()} onPause={() => onPause.current()}>
          controls
          <source src={streamUrl} type='audio/mpeg' />
          <track kind='captions' />
        </audio>
      )
    }, []),
    label: useMemo(() => {
      return <>
        <Piece>LIVE NOW <LivePulse /></Piece>
        {now && (
          <Piece>
            <Link to={now.show.slug}>{now.show.title}</Link> 'til <Time value={now.airshift.end} />
          </Piece>
        )}
      </>
    }, [now]),
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

export {
  useStreamPlayer
}
