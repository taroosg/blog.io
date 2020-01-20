import React from 'react'
import { graphql, StaticQuery } from 'gatsby'
import SEO from '../components/SEO'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Nav from '../components/Nav'
import SosialLinks from '../components/SocialLinks'
import { Global, css } from "@emotion/core"
import 'typeface-noto-sans-full'
// import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
// import styled from "@emotion/styled"

const globalStyle = css`
  * {
    box-sizing: border-box;
  }
  html {
    background: #3C4556;
    color: #dbd0e6;
    max-width: 768px;
    margin: 0 auto;
    font-family: Noto Sans;
  }
  body {
    margin: 0;
  }
  h1, h2, h3, p, a, ul, li {
    font-feature-settings: "palt";
    letter-spacing: .2rem;
  }
  h1 {
    font-size: 1.5em;
  }
  h2{
    font-size: 1.35em;
  }
  a {
    color: #d0c0e0;
    text-decoration: none;
    overflow-wrap : break-word;
  }
  p {
    line-height: 1.9;
    margin: 1.75em 0;
  }
  li {
    line-height: 1.9;
  }
  code {
    overflow: auto;
    overflow-wrap: break-word !important;
  }
  pre code{
    overflow-wrap: normal !important;
  }
`;


export default ({ children }) => (
  <StaticQuery
    query={graphql`
      query {
        site {
          siteMetadata {
            title
            description
            twitter
            github
          }
        }
      }
    `}
    render={data => (
      <div>
        <SEO
          title={data.site.siteMetadata.title}
          description={data.site.siteMetadata.description || ' '}
          pathname={data.site.siteMetadata.url}
        // article
        />
        <Global styles={globalStyle} />
        <Header title={data.site.siteMetadata.title} />
        <Nav
          description={data.site.siteMetadata.description}
          twitter={`https://twitter.com/${data.site.siteMetadata.twitter}`}
          github={`https://github.com/${data.site.siteMetadata.github}`}
        />
        {/* <Link to="/">
          <h1>{data.site.siteMetadata.title}</h1>
        </Link> */}
        {/* <p>{data.site.siteMetadata.description}</p>
        <a href={`https://twitter.com/${data.site.siteMetadata.twitter}`} target="_blank" rel="noopener noreferrer"><p>Twitter</p></a>
        <a href={`https://github.com/${data.site.siteMetadata.github}`} target="_blank" rel="noopener noreferrer"><p>Github</p></a> */}
        {/* <Link to="/">
          <p>Home</p>
        </Link>
        <Link to="/about">
          <p>About</p>
        </Link> */}
        {children}
        <SosialLinks
          twitter={`https://twitter.com/${data.site.siteMetadata.twitter}`}
          github={`https://github.com/${data.site.siteMetadata.github}`}
        />
        <Footer
          twitter={`https://twitter.com/${data.site.siteMetadata.twitter}`}
          github={`https://github.com/${data.site.siteMetadata.github}`}
        />
      </div>
    )}
  />
)