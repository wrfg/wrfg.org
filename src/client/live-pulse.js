import React from "react"

import { css } from "@emotion/core"

import { yellow } from "@/components/colors.js"

const LivePulse = () => {
  return (
    <span
      css={css`
        @keyframes pulsingAnimation {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        color: ${yellow};
        opacity: 1;
        animation: pulsingAnimation 2s infinite;
      `}
    >
      ●
    </span>
  )
}

export default LivePulse
