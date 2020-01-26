import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../layouts'
import TagList from '../components/TagList'
import SEO from '../components/SEO'
import PreviousNext from '../components/PreviousNext'
import article from '../styles/card'
import "../styles/prism-okaidia.css"
// import "../styles/prism-tomorrow-night.css"
// import "../styles/prism-twilight.css"
// import 'gatsby-prismjs-dracula';

const Post = ({ data, pageContext }) => {
  const { next, prev } = pageContext
  const post = data.markdownRemark
  const title = post.frontmatter.title
  const date = post.frontmatter.date
  const html = post.html

  return (
    <Layout>
      <SEO
        title={title}
        description={post.frontmatter.description || post.excerpt || ' '}
        pathname={post.frontmatter.path}
        article
      />
      <div css={article}>
        <h2>{title}</h2>
        <p css={{ textAlign: 'center' }}>{date}</p>
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <TagList tags={post.frontmatter.tags || []} />
      </div>
      <PreviousNext
        prev={prev}
        next={next}
      />
    </Layout>
  )
}
export const query = graphql`
  query($pathSlug: String!) {
    markdownRemark(frontmatter: { path: {eq: $pathSlug} }) {
      html
      frontmatter {
        date(formatString: "DD MMMM, YYYY")
        title
        tags
      }
    }
  }
`
export default Post
