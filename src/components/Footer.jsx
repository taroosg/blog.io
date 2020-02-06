import React from 'react'
import { Link } from 'gatsby'

const footer = {
  backgroundColor: '#a59aca',
  color: '#2A2C37',
  width: '100%',
  height: '8%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '1.5em',
}

const Footer = props => {
  return (
    <footer css={footer}>
      <p css={{ textAlign: 'center' }}>
        {`© 2018 taroosg `}
        <Link to={`/privacyPolicy`}>
          {` privacy policy`}
        </Link>
      </p>
    </footer>
  )
}
export default Footer