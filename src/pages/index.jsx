import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../layouts'
import TagList from '../components/TagList'
import Readmore from '../components/Readmore'
import card from '../styles/card'

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
          <Readmore path={node.frontmatter.path} />
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