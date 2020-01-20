import React from 'react'
import { Link } from 'gatsby'
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

const icons = {
  padding: '0 1.5em 1.5em 1.5em',
  display: 'flex',
  justifyContent: 'space-between',
}

const PreviousNext = props => {
  return (
    <div css={icons}>
      {props.prev ?
        <Link to={props.prev.frontmatter.path}>
          <NavigateBeforeIcon />
        </Link>
        : <div></div>
      }
      {props.next ?
        <Link to={props.next.frontmatter.path}>
          <NavigateNextIcon />
        </Link>
        : <div></div>
      }
    </div>
  )
}
export default PreviousNext;