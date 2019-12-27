import React, { useState, useRef } from "react"

const Context = React.createContext({
  install: () => {},
  live: null,
})

const Wrapper = ({ children }) => {
  const audioElementRef = useRef(null)
  const [ state, setState ] = useState('paused')

  const play = () => audioElementRef.current.play()
  const pause = () => audioElementRef.current.pause()

  const value = {
    play: play,
    pause: pause,
    state: state,
  }

  const onPlay = () => {
    setState('playing')
    audioElementRef.current.currentTime = 0
  }

  const onPause = () => {
    setState('paused')
  }

  return <Context.Provider value={value}>
    {children}
    <audio preload="none" ref={audioElementRef} onPlay={() => onPlay()} onPause={() => onPause()}>
      controls
      <source src="http://streaming.wrfg.org/" type="audio/mpeg" />
      <track kind="captions" />
    </audio>
  </Context.Provider>
}

export {
  Wrapper,
  Context,
}
