import React, { useContext, useState } from 'react'

import { css } from "@emotion/core"
import { grey } from './colors'

import { Stack, Button, hoverStyles } from './parts'

const Context = React.createContext({})

const Form = ({ initialValues, onSubmit, children }) => {
  const [state, setState] = useState(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onChange = (name, value) => {
    setState((s) => {
      return {...s, [name]: value}
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    await onSubmit(state)
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Context.Provider value={{values: state, onChange, isSubmitting}}>
        <Stack>
          {children}
        </Stack>
      </Context.Provider>
    </form>
  )
}

const Input = ({ name, label, presentation, options }) => {
  const context = useContext(Context)

  return (
    <Stack gap={1}>
      <div>{label}</div>
      {React.createElement(presentation, {
        name,
        label,
        options,
        value: context.values[name],
        onChange: (newValue) => context.onChange(name, newValue)
      })}
    </Stack>
  )
}

const Submit = ({ disabled, children }) => {
  const { isSubmitting } = useContext(Context)

  return (
    <Button disabled={disabled || isSubmitting} type='primary' behavior='submit'>{children}</Button>
  )
}

const Radio = ({ name, options, value, onChange }) => {
  return (
    <div>
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
              disabled={'disabled' in option && option.disabled}
            />
            <label htmlFor={id}>{option.label}</label>
          </div>
        )
      })}
    </div>
  )
}

const base = css`
  padding: 0.75em 1.5em;
  border: 1px solid ${grey};
  font-size: .75em;
  border-radius: 0.25em;
`

const Dropdown = ({ name, options, value, onChange }) => {
  return (
    <div>
      <select
        css={css`
          ${base}

          background-color: white;

          padding-right: 3em;

          -webkit-appearance: none;
          -moz-appearance: none;
          -ms-appearance: none;
          -o-appearance: none;
          appearance: none;
          background-image: url("/icons/chevron-expand.svg");
          background-repeat: no-repeat;
          background-position: center right calc(1em - 2px);

          ${hoverStyles}
        `}
        name={name}
        value={value}
        onBlur={(e) => onChange(e.target.value)}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </div>
  )
}

export const Dollars = ({ name, value, onChange }) => {
  return (
    <div>
      <input
        css={css`
          ${base}
          -webkit-appearance: none !important;
          outline: none;
          border-right: 0;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          padding-right: 0;
          box-sizing: content-box;
          width: 1em;
        `}
        value="$"
        readOnly
        disabled
      />
      <input
        css={css`
          ${base}
          border-left: 0;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          padding-left: 0;
          ${hoverStyles}
        `}
        type="number"
        step="0.01"
        min="0.01"
        name={name}
        value={value / 100}
        onChange={(e) => onChange(Math.round(e.target.value * 100))}
      />
    </div>
  )
}

export const Buttons = ({ name, options, value, onChange }) => {
  return (
    <div>
      <div css={css`
        display: flex;
        flex-wrap: wrap;
        margin-bottom: -0.5em;

        & > * {
          margin-bottom: 0.5em;
          &:not(:last-of-type) {
            margin-right: 0.5em;
          }
        }
      `}>
        {options.map((option) => <Button key={option.value} type={value === option.value ? 'secondary' : 'tertiary'} onClick={() => onChange(option.value)}>{option.label}</Button>)}
      </div>
    </div>
  )
}

export { Form, Input, Radio, Dropdown, Submit, Context }