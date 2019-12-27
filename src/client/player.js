import React, { useRef, useState } from "react"

import { css } from "@emotion/core"

import Loadable from "@loadable/component"

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

        color: red;
        opacity: 1;
        animation: pulsingAnimation 2s infinite;
      `}
    >
      ●
    </span>
  )
}

const Player = () => {
  // bug: operating system media buttons can act on the <audio> element, causing it to play, but the ui doesn't reflect that state
  // bug: full page reload causes player to stop
  const [ state, setState ] = useState("paused")
  const audioElementRef = useRef(null)

  const toggle = () => {
    if (state === "paused") {
      audioElementRef.current.play()
      return;
    }

    if (state === "playing") {
      audioElementRef.current.pause()
      return;
    }

    throw new Error(`Invalid state ${state}`)
  }

  const onPlay = () => {
    setState('playing')
    audioElementRef.current.currentTime = 0
  }

  const onPause = () => {
    setState('paused')
  }

  return (
    <>
      <button
        onClick={() => toggle()}
        css={css`border: none; background: transparent; width: 1.6em; height: 1.6em; text-align: center; padding: 0;`}
      >
        {state === "playing" ? "◼️" : "▶︎"}
      </button>
      <span css={css`margin-left: .5em`}>LIVE NOW <PulsingRedCircle /></span>
      <audio preload="none" ref={audioElementRef} onPlay={() => onPlay()} onPause={() => onPause()}>
        controls
        <source src="http://streaming.wrfg.org/" type="audio/mpeg" />
        <track kind="captions" />
      </audio>
    </>
  )
}

export default Player

const LoadablePlayer = Loadable(() => import("./player"))

export { LoadablePlayer }
