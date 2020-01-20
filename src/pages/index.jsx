import React from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../layouts'
import TagList from '../components/TagList'
import card from '../styles/card'

const readMore = {
  // background: '#BD92F9',
  // color: '#020202',
  border: '1px solid #dbd0e6',
  padding: '20px',
  margin: '0 auto 1.75em auto',
  width: '200px',
  fontSize: '1em',
  display: 'block',
  textAlign: 'center',
}

export default ({ data }) => {
  const { edges } = data.allMarkdownRemark
  return (
    <Layout>
      {edges.map(({ node }) => (
        <div key={node.id} css={card}>
          <h2>{node.frontmatter.title}</h2>
          <p css={{ textAlign: 'center' }}>{node.frontmatter.date}</p>
          <p>{node.frontmatter.description}</p>
          {/* <p>{node.excerpt}</p> */}
          <Link to={node.frontmatter.path} css={readMore}>
            read more
          </Link>
          <TagList tags={node.frontmatter.tags || []} />
        </div>
      ))}
    </Layout>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark (sort: { order: DESC, fields: [frontmatter___date] },filter: { frontmatter: { published: { eq: true } } }) {
      edges {
        node {
          id
          excerpt(pruneLength: 100)
          frontmatter {
            title
            description
            date(formatString: "MMMM DD, YYYY")
            path
            tags
          }
        }
      }
    }
  }
`