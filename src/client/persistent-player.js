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

  const unregister = useCallback((id) => {
    setRegistry((registry) => {
      const clone = Object.assign({}, registry)
      if (id !== active) {
        delete clone[id]
      }
      return clone
    })
  }, [active])

  const seize = useCallback((seizer) => {
    const toPause = Object.entries(registry).filter(([ id, player ]) => id !== seizer)
    toPause.forEach(([ id, player ]) => player.pause())
    setActive(seizer)
  }, [registry])

  const reset = useCallback(() => {
    setActive(null)
  }, [])

  const play = useCallback((id) => {
    registry[id].play()
    seize(id)
  }, [registry, seize])

  const pause = useCallback((id) => {
    reset()
    registry[id].pause()
  }, [registry])

  const value = {
    registry: registry,
    register: register,
    unregister: unregister,
    seize: seize,
    active: active,
    reset: reset,
    play: play,
    pause: pause,
  }

  return <Context.Provider value={value}>
    {children}
    {Object.entries(registry).map(([ id, player ]) => {
      return <Fragment key={id}>{player.element}</Fragment>
    })}
  </Context.Provider>
}

const usePersistentPlayer = ({ id, play, pause, element, label }) => {
  const { unregister, register, seize, active, reset } = useContext(Context)

  useEffect(() => {
    register(id, {
      play: play,
      pause: pause,
      element: element,
      label: label,
    })

    return () => {
      unregister(id)
    }
  }, [register, id, active, play, pause, element, label])

  const state = active === id ? 'playing' : 'paused'
  return {
    state: state,
    setState: (updatedState) => {
      if (state !== 'playing' && updatedState === 'playing') {
        seize(id)
      }

      if (state !== 'paused' && updatedState === 'paused') {
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
