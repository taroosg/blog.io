import React from 'react'
import { Link } from 'gatsby'
// import { jsx, css } from "@emotion/core"
const title = {
  backgroundColor: '#a59aca',
  color: '#2A2C37',
  width: '100%',
  height: '8%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}
const sticky = {
  position: 'sticky',
  top: '0',
  zIndex: '100',
}

const Header = props => {
  return (
    <header css={sticky}>
      <Link to="/">
        <div css={title}>
          <h1>{props.title}</h1>
        </div>
      </Link>
    </header>
  )
}
export default Header