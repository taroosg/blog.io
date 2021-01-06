import React from 'react'
// import { Link } from 'gatsby'
import SosialLinks from './SocialLinks'

const nav = {
  position: 'fixed',
  width: '100%',
  maxWidth: '720px',
  zIndex: -1,
}

const Nav = props => {
  return (
    <div>
      <p css={{ textAlign: 'center' }}>{props.description}</p>
      <SosialLinks
        twitter={props.twitter}
        github={props.github}
      />
    </div>

  )
}
export default Nav;