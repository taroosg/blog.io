import React from 'react'
// import { Link } from 'gatsby'
import SosialLinks from './SocialLinks'

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