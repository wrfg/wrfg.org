import React, { useRef, useEffect, useState } from "react"

import parse from "url-parse"

import useScript from 'react-script-hook'

import Loadable from "@loadable/component"

const MixcloudPlayer = ({ url }) => {
  const parsed = parse(url)
  const cloudcastKey = parsed.pathname

  const initialSrc = "https://www.mixcloud.com/widget/iframe/"
    + "?hide_cover=1&autoplay=false&mini=1&light=1&feed=" + encodeURIComponent(cloudcastKey)


  const iframe = useRef(null)
  const [ loaded, setLoaded ] = useState(false)
  const mixcloudWidgetRef = useRef(null)
  const resolver = useRef(null)
  const ready = useRef(null)
  if (ready.current === null) {
    ready.current = new Promise((resolve, reject) => {
      resolver.current = resolve
    })
  }

  const [ state, setState ] = useState("unloaded")

  const [ loading, error ] = useScript({
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
        resolver.current()
      })

    }
  })

  const toggle = (e) => {
    if (state === 'paused' || state === 'unloaded') {
      ready.current.then(() => {
        mixcloudWidgetRef.current && mixcloudWidgetRef.current.play()
        setState("playing")
      })
      return
    }

    if (state === 'playing') {
      ready.current.then(() => {
        mixcloudWidgetRef.current && mixcloudWidgetRef.current.pause()
        setState("paused")
      })
      return
    }

    throw new Error('Invalid state')
  }

  const styles = {
    border: 0,
    width: '100%',
    display: state === 'unloaded' ? 'none' : 'block',
  }

  return (<>
    {loaded && state === 'unloaded' && (<button onClick={(e) => toggle(e)}>{state === 'paused' || state === 'unloaded' ? 'play' : 'pause'}</button>)}
    <iframe style={styles} ref={iframe} />
  </>)
}

export default MixcloudPlayer

const LoadableMixcloudPlayer = Loadable(() => import("./mixcloud-player"))

export { LoadableMixcloudPlayer }
