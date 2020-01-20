import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../layouts'
import card from '../styles/card'

export default ({ data }) => (
  <Layout>
    <div css={card}>
      <h2>Who am I?</h2>
      <ul>
        <li><p>{data.site.siteMetadata.author}</p></li>
        <li><p>G's ACADEMY FUKUOKA chief lecturer</p></li>
        <li><p>From 2018 in Fukuoka</p></li>
        <li><p>From 2018 in G's ACADEMY</p></li>
        <li><p>17th November 1987</p></li>
        <li>
          <p>Interests: </p>
          <ul>
            <li><p>Javascript</p></li>
            <li><p>Typescript</p></li>
            <li><p>React</p></li>
            <li><p>Firebase</p></li>
            <li><p>PHP</p></li>
            <li><p>Laravel</p></li>
            <li><p>Flutter</p></li>
            <li><p>Haskell</p></li>
          </ul>
        </li>
        <li>
          <p>Like: </p>
          <ul>
            <li><p>Islay whiskey</p></li>
            <li><p>Craft gin</p></li>
          </ul>
        </li>
      </ul>


    </div>
  </Layout>
)

export const query = graphql`
  query AboutQuery {
    site {
      siteMetadata {
        title
        author
      }
    }
  }
`
