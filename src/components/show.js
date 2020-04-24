import React from 'react'

import { css } from '@emotion/core'

import { lightGrey } from '@/components/colors'

import Time from '@/components/time'


export const Range = ({ start, end }) => {
  return <span><Time value={start} />{' - '}<Time value={end} /></span>
}

export const Shift = ({ value }) => {
  return <span>{value.day}s <Range start={value.start} end={value.end} /></span>
}

export const ShowImageSquare = ({ show }) => {
  const { bannerImageUrl } = show

  return <div
    css={css`
      overflow: hidden;
      border: 1px solid ${lightGrey};
      border-radius: 0.25em;
      width: 100%;
    `}
  >
    {
      bannerImageUrl ? (
        <div
        css={css`
          padding-bottom: 100%;
          width: 100%;
          background-image: url(${bannerImageUrl});
          background-repeat: no-repeat;
          background-position: center center;
          background-size: cover;
        `}
        />
      ) : (
        <div
        css={css`
          padding-bottom: 100%;
          width: 100%;
          position: relative;
        `}
        >
          <div css={css`
            position: absolute;
            width: 120%;
            height: 120%;
            top: -10%;
            left: -10%;
            background-image: url(/images/logo-disk.png);
            background-size: 40%;
            transform: rotate(15deg);
            background-position: center center;
            opacity: 0.5;
          `}/>
        </div>
      )
    }
  </div>
}

export const ShiftSummary = ({ airshifts }) => {
  if (airshifts.length === 1) {
    return <Shift value={airshifts[0]} />
  }

  const first = airshifts[0]
  const sameTime = airshifts.reduce((accumulation, item) => {
    return accumulation && item.start === first.start && item.end === first.end
  }, true)
  if (sameTime) {
    const days = airshifts.map((airshift) => airshift.day).map((day) => {
      return {
        'Sunday': 0,
        'Monday': 1,
        'Tuesday': 2,
        'Wednesday': 3,
        'Thursday': 4,
        'Friday': 5,
        'Saturday': 6,
      }[day]
    }).sort().map((ordinal) => {
      return {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday',
      }[ordinal]
    })
    let range = `${days[0]} - ${days[days.length - 1]}`
    if (range === 'Monday - Friday') {
      range = 'Weekdays'
    }
    return <span>{range} <Range start={first.start} end={first.end} /></span>
  }

  return (
    <span>
      {airshifts.map((airshift, index) => {
        return (
          <React.Fragment key={index}>
            {index > 0 && ', '}
            <Shift value={airshift} />
          </React.Fragment>
        )
      })}
    </span>
  )
}
