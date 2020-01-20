import React from 'react'
import { Link } from 'gatsby'
import tagButton from '../styles/tagButton'
// import { jsx, css } from "@emotion/core"

const tagList = {
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
}

const TagList = ({ tags }) => {
  return (
    <div css={tagList}>
      {tags.map(tag =>
        // <button css={tagButton}>
        <Link key={tag} to={`/tags/${tag}`} css={tagButton}>
          #{tag}
        </Link>
        // </button>
      )}
    </div>
  )
}

export default TagList