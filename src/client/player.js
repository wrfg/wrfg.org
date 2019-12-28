import React, { useRef, useMemo, useCallback } from "react"

import { Link } from "gatsby"

import { css } from "@emotion/core"

import Time from "@/components/time.js"
import { Piece } from '@/components/parts.js'

import { useShows, zeitgeist } from "@/models/show.js"

import { Context as PersistentPlayerContext, usePersistentPlayer } from './persistent-player.js'
import PlayPause from './play-pause.js'
import LivePulse from './live-pulse.js'


const streamUrl = 'http://streaming.wrfg.org/'
const useStreamPlayer = (id) => {
  const shows = useShows()
  const [ now ] = zeitgeist(shows)

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
  const label = useMemo(() => {
    return <>
      <Piece>LIVE NOW <LivePulse /></Piece>
      {now && (
        <Piece>
          <Link to={now.show.slug}>{now.show.title}</Link> 'til <Time value={now.airshift.end} />
        </Piece>
      )}
    </>
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
    label: label,
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
