import React, { useRef, useMemo, useCallback } from 'react'

import { Link } from 'gatsby'

import Time from '@/components/time'
import { Piece } from '@/components/parts'

import { useShows, zeitgeist } from '@/models/show'

import { usePersistentPlayer } from './persistent-player'
import LivePulse from './live-pulse'

const streamUrl = 'https://s2.radio.co/s2133c4bad/listen'
const useStreamPlayer = (id) => {
  const shows = useShows()
  const [ now ] = useMemo(() => zeitgeist(shows), [shows])

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
