import React, { useRef, useMemo, useCallback } from 'react'

import Time from '@/components/time'
import { UnadornedLink } from '@/components/parts'
import { useNow } from '@/now'
import { useShows, zeitgeist } from '@/models/show'

import { usePersistentPlayer } from './persistent-player'
import LivePulse from './live-pulse'

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
        <div>LIVE NOW <LivePulse /></div>
        {now && (
          <div>
            <UnadornedLink to={now.show.slug}>{now.show.title}</UnadornedLink> 'til <Time value={now.airshift.end} />
          </div>
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
