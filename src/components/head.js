import React from "react"

import { Helmet } from "react-helmet-async"

export default () => {
  return (
    <Helmet
      title={`WRFG`}
      meta={[
        {name: 'charset', content: 'utf-8'},
        {name: 'apple-mobile-web-app-title', content: 'WRFG'},
        //{name: 'apple-mobile-web-app-capable', content: 'yes'},// until navigation can be done without changing the url, setting this is a subpar experience
      ]}
      link={[
        {rel: 'apple-touch-startup-image', href: '/images/logo-disk-white.png'},
        {rel: 'apple-touch-icon', href: '/images/logo-disk-white.png'},
      ]}
    />
  )
}
