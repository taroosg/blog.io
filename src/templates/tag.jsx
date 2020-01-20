import React from 'react'
import { Link } from 'gatsby'
import Layout from '../layouts'
// import { jsx, css } from "@emotion/core"
import TagList from '../components/TagList'
import card from '../styles/card'
import tagButton from '../styles/tagButton'

const Tag = ({ pageContext }) => {
  const { posts, tagName } = pageContext
  return (
    <Layout>
      <Link key={tagName} to={`/tags/${tagName}`} css={tagButton}>
        #{tagName}
      </Link>
      <div>
        {/* <ul> */}
        {posts.map((post, index) => {
          return (
            // <li key={index}>
            //   <Link to={post.frontmatter.path}>
            //     {post.frontmatter.title}
            //   </Link>
            // </li>
            <div key={index} css={card}>
              <Link to={post.frontmatter.path}>
                <h3>{post.frontmatter.title}</h3>
                <p>{post.frontmatter.date}</p>
                <p>{post.frontmatter.description}</p>
                {/* <p>{node.excerpt}</p> */}
              </Link>
              <TagList tags={post.frontmatter.tags || []} />
            </div>
          )
        })}
        {/* </ul> */}
      </div>
    </Layout>
  )
}

export default Tag