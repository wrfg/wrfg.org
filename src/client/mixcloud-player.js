import React, { useRef, useState, useCallback, useMemo } from "react"

import parse from "url-parse"

import useScript from 'react-script-hook'

import Loadable from "@loadable/component"

import { usePersistentPlayer } from './persistent-player.js'

const MixcloudPlayer = ({ url }) => {
  const parsed = parse(url)
  const cloudcastKey = parsed.pathname

  const initialSrc = "https://www.mixcloud.com/widget/iframe/"
    + "?hide_cover=1&autoplay=false&mini=1&light=1&feed=" + encodeURIComponent(cloudcastKey)

  const iframe = useRef(null)
  const [ loaded, setLoaded ] = useState(false)
  const mixcloudWidgetRef = useRef(null)
  const onPlay = useRef(() => {})
  const onPause = useRef(() => {})
  const resolver = useRef(null)
  const ready = useRef(null)
  if (ready.current === null) {
    ready.current = new Promise((resolve, reject) => {
      resolver.current = resolve
    })
  }

  useScript({
    src: 'https://widget.mixcloud.com/media/js/widgetApi.js',
    onload: () => {
      iframe.current.src = initialSrc

      /*global Mixcloud*/
      const widget = Mixcloud.PlayerWidget(iframe.current)
      mixcloudWidgetRef.current = widget

      widget.ready.then(() => {
        setLoaded(true)
        return widget.load(cloudcastKey, false)
      }).then(() => {
        mixcloudWidgetRef.current.events.play.on(() => onPlay.current())
        mixcloudWidgetRef.current.events.pause.on(() => onPause.current())
        mixcloudWidgetRef.current.events.ended.on(() => onPause.current())
      }).then(() => {
        resolver.current()
      })

    }
  })

  const {
    state,
    setState,
    play,
    pause,
  } = usePersistentPlayer({
    id: 'mixcloud',
    play: useCallback(() => {
      ready.current.then(() => {
        mixcloudWidgetRef.current && mixcloudWidgetRef.current.play()
      })
    }, []),
    pause: useCallback(() => {
      ready.current.then(() => {
        mixcloudWidgetRef.current && mixcloudWidgetRef.current.pause()
      })
    }, []),
    element: useMemo(() => {
      return <iframe style={{
        border: 0,
        width: '100%',
        display: 'none',
      }} ref={iframe} title="Mixcloud music player" />
    }, []),
  })

  onPause.current = () => {
    setState('paused')
  }

  onPlay.current = () => {
    setState('playing')
  }

  return (<>
    <button
      disabled={!loaded}
      onClick={(e) => state === 'playing' ? pause() : play()}
    >
      {state === 'playing' ? 'pause' : 'play'}
    </button>
  </>)
}

export default MixcloudPlayer
