import React, { Fragment, useState, useRef } from "react"

const Context = React.createContext()

const Wrapper = ({ children }) => {
  const [ registry, setRegistry ] = useState({})
  const [ state, setState ] = useState('paused')

  const register = (id, player) => {
    console.log(`registered ${id}`)
    const addition = {}
    addition[id] = player
    setRegistry(Object.assign({}, registry, addition))
  }

  const play = () => registry.stream.play()
  const pause = () => registry.stream.pause()

  const value = {
    register: register,
    play: play,
    pause: pause,
    state: state,
    setState: setState,
  }

  return <Context.Provider value={value}>
    {children}
    {Object.entries(registry).map(([ id, player ]) => {
      return <Fragment key={id}>{player.element}</Fragment>
    })}
  </Context.Provider>
}

export {
  Wrapper,
  Context,
}
