import React from 'react'
import { Link } from 'gatsby'
// import Layout from '../layouts'

const Tags = ({ pageContext }) => {
  console.log(pageContext)
  const { tags } = pageContext
  // const tags = ['js', 'react', 'php']
  console.log(tags);
  if (!tags) return null;
  return (
    <div>
      <ul>
        {tags.map((tagName, index) => {
          return (
            <li key={index}>
              <Link to={`/tags/${tagName}`}>
                {tagName}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Tags