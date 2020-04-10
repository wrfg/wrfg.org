import React from 'react'

import Layout from '@/components/layout'
import { Link } from 'gatsby'

const NotFound = () => {
  const url = new URL(window.location.href)
  const path = url.pathname + url.search + url.hash

  return (
    <Layout>
      <h3>Not found</h3>
      <p>There's no content at this URL, <code>{path}</code>. Consider <Link to='/'>starting from the top</Link>.</p>
    </Layout>
  )
}

export default NotFound