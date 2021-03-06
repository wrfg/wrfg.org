import React, { useRef, useCallback, useMemo } from 'react'

import { Link } from 'gatsby'

import parse from 'url-parse'

import useScript from 'react-script-hook'

import { usePersistentPlayer } from './persistent-player.js'
import PlayPause from './play-pause.js'

const MixcloudPlayer = ({ title, slug, url }) => {
  const id = 'mixcloud'
  const parsed = parse(url)
  const cloudcastKey = parsed.pathname

  const initialSrc = 'https://www.mixcloud.com/widget/iframe/'
    + '?hide_cover=1&autoplay=false&mini=1&light=1&feed=' + encodeURIComponent(cloudcastKey)

  const iframe = useRef(null)
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
    id: id,
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
      }} ref={iframe} title='Mixcloud music player' />
    }, []),
    label: useMemo(() => {
      return <Link to={slug}>{title}</Link>
    }, [title, slug]),
  })

  onPlay.current = () => {
    setState('playing')
  }

  onPause.current = () => {
    setState('paused')
  }

  return (<>
    <PlayPause play={play} pause={pause} state={state} />{' '}
    {title}
  </>)
}

export default MixcloudPlayer