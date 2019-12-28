import React, { Fragment, useContext, useState, useEffect, useCallback } from "react"

const Context = React.createContext({
  register: () => {},
  seize: () => {},
})

const Wrapper = ({ children }) => {
  const [ registry, setRegistry ] = useState({items: {}, order: []})
  const [ active, setActive ] = useState(null)

  const register = useCallback((id, player) => {
    const addition = {}
    addition[id] = player
    setRegistry((registry) => {
      return {
        items: Object.assign({}, registry.items, addition),
        order: registry.order.indexOf(id) === -1 ? registry.order.concat([id]) : registry.order,
      }
    })
  }, [])

  const unregister = useCallback((id) => {
    setRegistry((registry) => {
      const clone = Object.assign({}, registry.items)
      if (id !== active) {
        delete clone[id]
      }
      return {
        items: clone,
        order: registry.order,
      }
    })
  }, [active])

  const seize = useCallback(() => {
    Object.entries(registry.items).forEach(([ id, player ]) => player.pause())
  }, [registry])

  const play = useCallback((id) => {
    seize()
    registry.items[id].play()
    setActive(id)
  }, [registry, seize, setActive])

  const pause = useCallback((id) => {
    seize()
    setActive(null)
  }, [seize, setActive])

  const value = {
    registry: registry.items,
    order: registry.order,
    register: register,
    unregister: unregister,
    seize: seize,
    active: active,
    setActive: setActive,
    play: play,
    pause: pause,
  }

  return <Context.Provider value={value}>
    {children}
    {registry.order.map((id) => (registry.items[id] && <Fragment key={id}>{registry.items[id].element}</Fragment>))}
  </Context.Provider>
}

const usePersistentPlayer = (args) => {
  const { id, element, label } = args
  const playArg = args.play
  const pauseArg = args.pause

  const { unregister, register, seize, play, pause, setActive, active } = useContext(Context)

  useEffect(() => {
    register(id, {
      play: playArg,
      pause: pauseArg,
      element: element,
      label: label,
    })

    return () => {
      unregister(id)
    }
  }, [register, id, active, playArg, pauseArg, element, label, unregister])

  const state = active === id ? 'playing' : 'paused'
  return {
    state: state,
    setState: (updatedState) => {
      if (state !== 'playing' && updatedState === 'playing') {
        setActive(id)
      }

      if (state !== 'paused' && updatedState === 'paused') {
        setActive(null)
      }
    },
    play: () => {
      play(id)
    },
    pause: () => {
      pause(id)
    },
  }
}

export {
  Wrapper,
  Context,
  usePersistentPlayer,
}
