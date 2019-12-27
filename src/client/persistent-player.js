import React, { Fragment, useContext, useState, useEffect, useCallback } from "react"

const Context = React.createContext({
  register: () => {},
  seize: () => {},
})

const Wrapper = ({ children }) => {
  const [ registry, setRegistry ] = useState({})
  const [ active, setActive ] = useState(null)

  const register = useCallback((id, player) => {
    const addition = {}
    addition[id] = player
    setRegistry((registry) => Object.assign({}, registry, addition))
  }, [])

  const seize = useCallback((seizer) => {
    const toPause = Object.entries(registry).filter(([ id, player ]) => id !== seizer)
    toPause.forEach(([ id, player ]) => player.pause())
    setActive(seizer)
  }, [registry])

  const reset = useCallback(() => {
    setActive(null)
  }, [])

  const value = {
    register: register,
    seize: seize,
    active: active,
    reset: reset,
  }

  return <Context.Provider value={value}>
    {children}
    {Object.entries(registry).map(([ id, player ]) => {
      return <Fragment key={id}>{player.element}</Fragment>
    })}
  </Context.Provider>
}

const usePersistentPlayer = ({ id, play, pause, element }) => {
  // the stream persists, but the `state` doesn't. that needs to be put inside something on persistent player context
  const { register, seize, active, reset } = useContext(Context)

  useEffect(() => {
    register(id, {
      pause: pause,
      element: element,
    })
  }, [register, id, pause, element])

  return {
    state: active === id ? 'playing' : 'paused',
    setState: (state) => {
      if (state === 'playing') {
        seize(id)
      }

      if (state === 'paused') {
        reset()
      }
    },
    play: () => {
      seize(id)
      play()
    },
    pause: () => {
      pause()
    },
  }
}

export {
  Wrapper,
  Context,
  usePersistentPlayer,
}
