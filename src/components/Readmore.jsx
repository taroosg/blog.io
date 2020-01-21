import React from 'react'
import { Link } from 'gatsby'

const readMore = {
  border: '1px solid #dbd0e6',
  padding: '20px',
  margin: '0 auto 1.75em auto',
  width: '200px',
  fontSize: '1em',
  display: 'block',
  textAlign: 'center',
}

const Readmore = props => {
  return (
    <Link to={props.path} css={readMore}>
      read more
    </Link>
  )
}

export default Readmore;