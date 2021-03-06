import React from "react";
import { graphql } from "gatsby";
import Layout from "../layouts";
import card from "../styles/card";

export default ({ data }) => (
  <Layout>
    <div css={card}>
      <h2>Who am I?</h2>
      <ul>
        <li>
          <p>{data.site.siteMetadata.author}</p>
        </li>
        <li>
          <p>G's ACADEMY FUKUOKA chief lecturer</p>
        </li>
        <li>
          <p>From 2018 in Fukuoka</p>
        </li>
        <li>
          <p>From 2018 in G's ACADEMY</p>
        </li>
        <li>
          <p>17th November 1987</p>
        </li>
        <li>
          <p>Interests: </p>
          <ul>
            <li>
              <p>JavaScript</p>
            </li>
            <li>
              <p>TypeScript</p>
            </li>
            <li>
              <p>React</p>
            </li>
            <li>
              <p>Node.js</p>
            </li>
            <li>
              <p>PHP</p>
            </li>
            <li>
              <p>Laravel</p>
            </li>
            <li>
              <p>Flutter</p>
            </li>
            <li>
              <p>Haskell</p>
            </li>
          </ul>
        </li>
        <li>
          <p>Like: </p>
          <ul>
            <li>
              <a
                target="_blank"
                href="https://www.amazon.jp/hz/wishlist/ls/2W7J0GWI789YV?ref_=wl_share"
                rel="noopener noreferrer"
              >
                <p>Islay whiskey</p>
              </a>
            </li>
            <li>
              <a
                target="_blank"
                href="https://www.amazon.jp/hz/wishlist/ls/2QRAOKJ20INNP?ref_=wl_share"
                rel="noopener noreferrer"
              >
                <p>Craft gin</p>
              </a>
            </li>
            <li>
              <a
                href="https://www.buymeacoffee.com/Bt1hreN"
                target="_blank"
                rel="noreferrer"
                style={{ verticalAlign: "middle" }}
              >
                <img
                  src="https://cdn.buymeacoffee.com/buttons/default-orange.png"
                  alt="Buy Me A Coffee"
                  style={{ height: 51, width: 217 }}
                />
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </Layout>
);

export const query = graphql`
  query AboutQuery {
    site {
      siteMetadata {
        title
        author
      }
    }
  }
`;
