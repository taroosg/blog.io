import React from "react";
import { graphql, StaticQuery } from "gatsby";
import SEO from "../components/SEO";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import SosialLinks from "../components/SocialLinks";
import { Global, css } from "@emotion/core";
import "typeface-noto-sans-full";
// import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
// import styled from "@emotion/styled"

const globalStyle = css`
  * {
    box-sizing: border-box;
  }
  html {
    background: #3c4556;
    color: #dbd0e6;
    max-width: 720px;
    margin: 0 auto;
    font-family: Noto Sans;
    font-size: 1.15rem;
  }
  body {
    margin: 0;
  }
  h1,
  h2,
  h3,
  p,
  a,
  ul,
  ol,
  li {
    font-feature-settings: "palt" 1;
    letter-spacing: 0.075rem;
  }
  h1 {
    font-size: 1.35em;
    line-height: 0.8rem;
  }
  h2 {
    font-size: 1.35em;
  }
  a {
    color: #d0c0e0;
    text-decoration: none;
    overflow-wrap: break-word;
  }
  p {
    line-height: 1.9;
    margin: 1.75em 0;
  }
  li {
    line-height: 1.9;
  }
  pre {
    border: 1px solid #a59aca;
  }
  pre,
  code {
    letter-spacing: 0;
  }
  code {
    overflow: auto;
  }
  h1 code,
  h2 code,
  h3 code,
  p code {
    color: #a59aca !important;
    overflow-wrap: break-word !important;
    word-break: break-word !important;
  }
  pre > code {
    overflow-wrap: normal !important;
  }
  .mainText h2,
  .mainText h3 {
    border-left: 6px solid #dbd0e6;
    padding: 0.5rem;
  }
  .mainText h2 {
    border-bottom: 1px solid #dbd0e6;
  }
  img {
    box-shadow: "0px 0px 10px -5px #000";
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
            banner
            twitter
            github
          }
        }
      }
    `}
    render={(data) => (
      <div>
        <SEO
          title={data.site.siteMetadata.title}
          description={data.site.siteMetadata.description || " "}
          pathname={data.site.siteMetadata.url}
          banner={data.site.siteMetadata.banner}
          article
        />
        <Global styles={globalStyle} />
        <Header title={data.site.siteMetadata.title} />
        <Nav
          description={data.site.siteMetadata.description}
          twitter={`https://twitter.com/${data.site.siteMetadata.twitter}`}
          github={`https://github.com/${data.site.siteMetadata.github}`}
        />
        <div>
          {children}
        </div>
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
);
