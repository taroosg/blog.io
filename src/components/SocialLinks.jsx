import React from 'react'
import { Link } from 'gatsby'
import InfoIcon from '@material-ui/icons/Info';
import TwitterIcon from '@material-ui/icons/Twitter';
import GitHubIcon from '@material-ui/icons/GitHub';

const icons = {
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
}

const SocialLinks = props => {
  return (
    <div css={icons}>
      <Link to="/about">
        <InfoIcon />
      </Link>
      <a href={props.twitter} aria-label={`${props.twitter}`} target="_blank" rel="noopener noreferrer">
        <TwitterIcon />
      </a>
      <a href={props.github} aria-label={`${props.github}`} target="_blank" rel="noopener noreferrer">
        <GitHubIcon />
      </a>
    </div>
  )
}
export default SocialLinks;