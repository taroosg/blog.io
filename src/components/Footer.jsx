import React from 'react'

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
      <p css={{ textAlign: 'center' }}>© 2018 taroosg</p>
    </footer>
  )
}
export default Footer