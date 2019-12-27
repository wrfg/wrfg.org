import React, { Fragment, useState, useCallback } from "react"

const Context = React.createContext()

const Wrapper = ({ children }) => {
  const [ registry, setRegistry ] = useState({})

  const register = useCallback((id, player) => {
    const addition = {}
    addition[id] = player
    setRegistry((registry) => Object.assign({}, registry, addition))
  }, [])

  const seize = useCallback((seizer) => {
    const toPause = Object.entries(registry).filter(([ id, player ]) => id !== seizer)
    toPause.forEach(([ id, player ]) => player.pause())
  }, [registry])

  const value = {
    register: register,
    seize: seize,
    registry: registry,
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
