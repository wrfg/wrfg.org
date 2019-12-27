import React from "react"

import { Link } from "gatsby"

const Now = ({ now, next }) => {
  return (
    <>
      <p><Link to={now.show.slug}>{now.show.title}</Link> is currently on air.</p>
      {next ? (<p>Up next is <Link to={next.show.slug}>{next.show.title}</Link>.</p>) : null}
    </>
  )
}

export default Now
