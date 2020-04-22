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
      skus: {
        donate1000: 'sku_H3zZhVyNjWA4Xk',
        donate2000: 'sku_H3pfXA8NLouPeJ',
        donate5000: 'sku_H3zajX6yWC0Cz5',
        donate8930: 'sku_H80mAe8SCr08pN',
        donate12000: 'sku_H80pDGewTcRKXD',
        donate25000: 'sku_H80pYol2qvBa1r',
        donate36500: 'sku_H80qA7BCSe6cOZ',
        donate50000: 'sku_H80qwIVuezRNyy',
      },
      plans: {
        monthly1000: 'plan_H3zYyHFy8Sa8To',
        monthly2000: 'plan_H3zHNcxxYClrQW',
        monthly5000: 'plan_H3zZHkerzBSuwx',
        monthly8930: 'plan_H80nFMjv3aOX8P',
        monthly12000: 'plan_H80r6mFHkQTHFF',
        monthly25000: 'plan_H80st2RR9LC19L',
        monthly50000: 'plan_H80tLb03i0ooTc',
      },
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

const useEnviromentVariable = (variableName) => {
  return useContext(EnvironmentContext)[variableName]
}

export { EnvironmentWrapper, EnvironmentContext, useEnviromentVariable }