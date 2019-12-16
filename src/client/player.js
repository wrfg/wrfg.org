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

/*
const readStatus = async () => {
  const body = await fetch("http://streaming.wrfg.org/7.html")
  const [
    currentListeners,
    streamStatus,
    peakListeners,
    maxListeners,
    uniqueListeners,
    bitRate,
    songTitle,
  ] = body.split(",")

  return {
    currentListeners: currentListeners,
    streamStatus: streamStatus,
    peakListeners: peakListeners,
    maxListeners: maxListeners,
    uniqueListeners: uniqueListeners,
    bitRate: bitRate,
    songTitle: songTitle,
  }
}
*/

const Player = () => {
  // bug: operating system media buttons can act on the <audio> element, causing it to play, but the ui doesn't reflect that state
  const [ state, setState ] = useState("paused")

  const toggle = () => {
    if (state === "paused") {
      audioElementRef.current.play()
      setState("playing")
      return;
    }

    if (state === "playing") {
      audioElementRef.current.pause()
      setState("paused")
      return;
    }

    throw new Error(`Invalid state ${state}`)
  }

  const audioElementRef = useRef(null)

  return (
    <>
      <button
        onClick={() => toggle()}
        css={css`border: none; background: transparent; width: 1.6em; height: 1.6em; text-align: center; padding: 0;`}
      >
        {state === "playing" ? "◼️" : "▶︎"}
      </button>
      <span css={css`margin-left: .5em`}>LIVE NOW <PulsingRedCircle /></span>
      <audio preload="none" ref={audioElementRef}>
        <source src="http://streaming.wrfg.org/" type="audio/mpeg" />
        <track kind="captions" />
      </audio>
    </>
  )
}

export default Player

const LoadablePlayer = Loadable(() => import("./player"))

export { LoadablePlayer }
