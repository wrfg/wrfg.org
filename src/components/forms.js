import React, { useContext, useState } from 'react'

const Context = React.createContext({})

const Form = ({ initialValues, onSubmit, children }) => {
  const [state, setState] = useState(initialValues);
  const onChange = (name, value) => {
    setState((s) => {
      return {...s, [name]: value}
    })
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(state)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Context.Provider value={{values: state, onChange}}>
        {React.Children.map(children, (child, index) => {
          return (
            <>
              {index >= 1 ? <br /> : null}
              {child}
            </>
          )
        })}
      </Context.Provider>
    </form>
  )
}

const Input = ({ name, label, presentation, options }) => {
  const context = useContext(Context)

  return (
    React.createElement(presentation, {
      name,
      label,
      options,
      value: context.values[name],
      onChange: (newValue) => context.onChange(name, newValue)
    })
  )
}

const Submit = ({ disabled, children }) => {
  return (
    <button disabled={disabled} type='submit'>{children}</button>
  )
}

const Radio = ({ name, label, options, value, onChange }) => {
  return (
    <>
      <div>{label}</div>
      {options.map((option) => {
        const id = `${name}-${option.value}`

        return (
          <div key={id}>
            <input
              type='radio'
              id={id}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <label htmlFor={id}>{option.label}</label>
          </div>
        )
      })}
    </>
  )
}

export { Form, Input, Radio, Submit }