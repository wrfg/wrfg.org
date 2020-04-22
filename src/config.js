import React, { createContext, useContext, useState, useEffect } from 'react'

const defaultEnvironment = { stripeMode: 'TEST' }

const EnvironmentContext = createContext({
  environment: defaultEnvironment,
  set: (name, value) => {},
  reset: () => {},
})

const stripeConfig = (mode) => {
  if (mode === 'LIVE') {
    return {
      mode: 'LIVE',
      publishableApiKey: 'TODO',
    }
  }

  if (mode === 'TEST') {
    return {
      mode: 'TEST',
      publishableApiKey: 'pk_test_o2nK5qQJrQq1bEgaMQLIDR9M00X88P0DLZ',
    }
  }

  throw new Error(`Unknown stripe mode \`${mode}\``)
}

const useLocalStorageItem = (key) => {
  const [value, setValue] = useState(localStorage.getItem(key))

  useEffect(() => {
    localStorage.setItem(key, value)
  }, [key, value])

  return [value, setValue]
}

const useTranslation = ([internalValue, setInternalValue], encode, decode) => {
  const value = decode(internalValue)
  const setValue = (decodedValue) => setInternalValue(encode(decodedValue))

  return [value, setValue]
}

const EnvironmentWrapper = ({ children }) => {
  const [value, setValue] = useLocalStorageItem('environment')
  const [environment, setEnvironment] = useTranslation(
    [value, setValue],
    (decodedValue) => {
      return JSON.stringify(decodedValue)
    },
    (encodedValue) => {
      try {
        return JSON.parse(encodedValue) || defaultEnvironment
      } catch (e) {
        return defaultEnvironment
      }
    },
  )

  const set = (name, value) => setEnvironment({...environment, [name]: value})

  const reset = () => setValue(null)

  return <EnvironmentContext.Provider value={{ environment, set, reset }}>
    {children}
  </EnvironmentContext.Provider>
}

const useConfig = () => {
  const { environment: { stripeMode } } = useContext(EnvironmentContext)

  return {
    stripe: stripeConfig(stripeMode),
  }
}

export { EnvironmentWrapper, EnvironmentContext, useConfig }