install cli
```bash
$ npm i -g gatsby-cli
```

create app
```bash
$ npm init -y
$ npm i react react-dom gatsby gatsby-source-filesystem gatsby-transformer-remark gatsby-plugin-catch-links
```

create gatsby-config.js
```js
module.exports = {
  siteMetadata: {
    title: 'Prisma Code',
    description: 'Notes on programming.',
    author: 'Taro Osg'
  },
}
```

create src/layouts/index.jsx
```jsx
import React from 'react'

export default ({ children }) => (
  <div>
    <h3>My Website Layout</h3>
    {children}
  </div>
)
```

create src/pages/index.jsx
```jsx
import React from 'react'
import Layout from '../layouts'

export default () => (
  <Layout>
    <h1>My Website Home Page</h1>
    <p>This is the home page</p>
  </Layout>
)
```

create src/pages/about.jsx
```jsx
import React from 'react'
import Layout from '../layouts'

export default () => (
  <Layout>
    <h1>My Website About</h1>
    <p>This is the about page.</p>
  </Layout>
)
```

check the site
```bash
$ gatsby develop
```

update src/layouts/index.jsx
```jsx
import React from 'react'
import { Link } from 'gatsby'

export default ({ children }) => (
  <div>
    <Link to="/">
      <h3>My Layout</h3>
    </Link>
    <Link to="/about">
      About
    </Link>
    {children}
  </div>
)
```

update src/pages/about.jsx
```jsx
import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../layouts'

export default ({ data }) => (
  <Layout>
    <h1>{data.site.siteMetadata.title} About</h1>
    <p>This is the about page.</p>
  </Layout>
)

export const query = graphql`
  query AboutQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
```

update src/layouts/index.jsx
```jsx
import React from 'react'
import { Link, graphql, StaticQuery } from 'gatsby'

export default ({ children }) => (
  <StaticQuery
    query={graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <div>
        <Link to="/">
          <h3>{data.site.siteMetadata.title} Layout</h3>
        </Link>
        <Link to="/about">
          About
        </Link>
        {children}
      </div>
    )}
  />
)
```

create posts/20200117-test/index.md
```md
---
path: '/test'
date: '2020-01-17'
title: 'My Test Post'
tags: ['gatsby', 'react', 'javascript']
---

This is my beautiful first post.
```

update gatsby-config.js
```js
module.exports = {
  siteMetadata: {
    title: 'Prisma Code',
    description: 'Notes on programming.',
    author: 'Taro Osg'
  },
  plugins: [
    'gatsby-plugin-catch-links',
    'gatsby-transformer-remark',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'posts',
        path: `${__dirname}/posts`
      }
    }
  ]
}
```

update src/pages/index.jsx
```jsx
import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../layouts'

export default ({ data }) => {
  const { edges } = data.allMarkdownRemark
  return (
    <Layout>
      <h1>Gatsby Tutorial Home Page</h1>
      {edges.map(({ node }) => (
        <div key={node.id}>
          <h3>{node.frontmatter.title}</h3>
          <p>{node.frontmatter.date}</p>
          <p>{node.excerpt}</p>
        </div>
      ))}
    </Layout>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark (sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          id
          excerpt(pruneLength: 100)
          frontmatter {
            title
            date
            path
          }
        }
      }
    }
  }
`
```

update posts/20200117-test/index.md
```md
---
path: '/test'
date: '2020-01-17'
title: 'My Test Post'
tags: ['gatsby', 'react', 'javascript']
published: true'
---

This is my beautiful first post.
```

add query
```
filter: {
  frontmatter: {
    status: { eq: "published" }
  }
}
```

update src/pages/index.jsx
```jsx
import { graphql, Link } from 'gatsby'
...
<Link to={node.frontmatter.path}>
  <h3>{node.frontmatter.title}</h3>
</Link>
...
```

create src/templates/post.jsx
```jsx
import React from 'react'

const Post = (props) => {
  console.log('後で消す', props)
  return (
    <div>
      This is a post
    </div>
  )
}
export default Post
```

create gatsby-node.js
```js
const path = require('path')

exports.createPages = (({graphql, actions}) => {
  const { createPage } = actions
  return new Promise((resolve, reject) => {
    const postTemplate = path.resolve('src/templates/post.jsx')

    resolve(
      graphql(
        `
          query {
            allMarkdownRemark {
              edges {
                node {
                  frontmatter {
                    path
                    title
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          return Promise.reject(result.errors)
        }

        const posts = result.data.allMarkdownRemark.edges;

        posts.forEach(({node}) => {
          const path = node.frontmatter.path

          createPage({
            path,
            component: postTemplate,
            context: {
              pathSlug: path
            }
          })
        })
      })
    )
  })
})
```

update src/templates/post.jsx
```jsx
import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../layouts'

const Post = ({ data }) => {
  const post = data.markdownRemark
  const title = post.frontmatter.title
  const date = post.frontmatter.date
  const html = post.html

  return (
    <Layout>
      <h1>{title}</h1>
      <p>{date}</p>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Layout>
  )
}
export const query = graphql`
  query($pathSlug: String!) {
    markdownRemark(frontmatter: { path: {eq: $pathSlug} }) {
      html
      frontmatter {
        date
        title
      }
    }
  }
`
export default Post
```

create src/pages/tags.jsx
```jsx
import React from 'react'

const Tags = props => {
  return (
    <div>
      Tags
    </div>
  )
}

export default Tags
```

create src/templates/tag.jsx
```jsx
import React from 'react'

const Tag = props => {
  return (
    <div>
      Tag
    </div>
  )
}

export default Tag
```

update gatsby-node.js
```js
const path = require('path')

exports.createPages = (({graphql, actions}) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const postTemplate = path.resolve('src/templates/post.jsx')
    const tagPage = path.resolve('src/pages/tags.jsx');
    const tagPosts = path.resolve('src/templates/tag.jsx');

    resolve(
      graphql(
        `
          query {
            allMarkdownRemark {
              edges {
                node {
                  frontmatter {
                    path
                    title
                    tags
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          return Promise.reject(result.errors)
        }

        const posts = result.data.allMarkdownRemark.edges;

        const postsByTag = {};

        posts.forEach(({ node }) => {
          if (node.frontmatter.tags) {
            node.frontmatter.tags.forEach(tag => {
              if (!postsByTag[tag]) {
                postsByTag[tag] = [];
              }
              postsByTag[tag].push(node);
            });
          }
        });

        const tags = Object.keys(postsByTag);

        tags.forEach(tagName => {
          const posts = postsByTag[tagName]
          createPage({
            path: `/tags/${tagName}`,
            component: tagPosts,
            context: {
              posts,
              tagName
            }
          })
        })

        createPage({
          path: '/tags',
          component: tagPage,
          context: {
            tags: tags.sort(),
          },
        });

        posts.forEach(({node}) => {
          const path = node.frontmatter.path

          createPage({
            path,
            component: postTemplate,
            context: {
              pathSlug: path
            }
          })
        })
      })
    )
  })
})
```

update src/pages/tags.jsx
```jsx
import React from 'react'
import { Link } from 'gatsby'

const Tags = ({ pageContext }) => {
  const { tags } = pageContext
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
```

update src/templates/tag.jsx
```jsx
import React from 'react'
import { Link } from 'gatsby'

const Tag = ({ pageContext }) => {
  const { posts, tagName } = pageContext
  return (
    <div>
      <div>
        Posts about {`${tagName}`}
      </div>
      <div>
        <ul>
          {posts.map((post, index) => {
            return (
              <li key={index}>
                <Link to={post.frontmatter.path}>
                  {post.frontmatter.title}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default Tag
```

create src/components/TagList.jsx
```jsx
import React from 'react'
import { Link } from 'gatsby'

const TagList = ({ tags }) => {
  return (
    <div>
      {tags.map(tag =>
        <Link key={tag} to={`/tags/${tag}`}>
          {tag}
        </Link>
      )}
    </div>
  )
}

export default TagList
```

update src/pages/post.jsx
```jsx
import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../layouts'
import TagList from '../components/TagList'

const Post = ({ data }) => {
  const post = data.markdownRemark
  const title = post.frontmatter.title
  const date = post.frontmatter.date
  const html = post.html

  return (
    <Layout>
      <h1>{title}</h1>
      <p>{date}</p>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <TagList tags={post.frontmatter.tags || []} />
    </Layout>
  )
}
export const query = graphql`
  query($pathSlug: String!) {
    markdownRemark(frontmatter: { path: {eq: $pathSlug} }) {
      html
      frontmatter {
        date
        title
        tags
      }
    }
  }
`
export default Post
```

update gatsby-node.js
```js
...
  posts.forEach(({ node }, index) => {
    const path = node.frontmatter.path
    const prev = index === 0 ? null : posts[index - 1].node;
    const next = index === posts.length - 1 ? null : posts[index + 1].node;

    createPage({
      path,
      component: postTemplate,
      context: {
        pathSlug: path,
        prev,
        next,
      }
    });
  });
...
```

update gatsby-node.js
```js
query {
  allMarkdownRemark (
    sort: {order: ASC, fields: [frontmatter___date]}
  ) {
    edges {
      node {
        frontmatter {
          path
          title
          date
        }
      }
    }
  }
}
```

update src/pages/post.jsx
```jsx
import React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../layouts'
import TagList from '../components/TagList'

const Post = ({ data, pageContext }) => {
  const { next, prev } = pageContext
  const post = data.markdownRemark
  const title = post.frontmatter.title
  const date = post.frontmatter.date
  const html = post.html

  return (
    <Layout>
      <h1>{title}</h1>
      <p>{date}</p>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <TagList tags={post.frontmatter.tags || []} />
      {next &&
        <Link to={next.frontmatter.path}>
          Next
        </Link>
      }
      {prev &&
        <Link to={prev.frontmatter.path}>
          Previous
        </Link>
      }
    </Layout>
  )
}
export const query = graphql`
  query($pathSlug: String!) {
    markdownRemark(frontmatter: { path: {eq: $pathSlug} }) {
      html
      frontmatter {
        date
        title
        tags
      }
    }
  }
`
export default Post
```

create src/images/logo.png
update src/layouts/index.jsx
```jsx
...
import logo from '../images/logo.png'
...
  <img src={logo} alt="logo" />
...
```

install images
```bash
$ npm i gatsby-transformer-sharp gatsby-plugin-sharp gatsby-remark-images gatsby-image
```

update config
```js
plugins: [
  'gatsby-plugin-catch-links',
  'gatsby-transformer-sharp',
  'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'posts',
        path: `${__dirname}/posts`
      }
  },
  {
    resolve: 'gatsby-transformer-remark',
    options: {
      plugins: [
        {
          resolve: 'gatsby-remark-images',
          options: {
            maxWidth: 690,
            quality: 90,
            linkImagesToOriginal: true,
          }
        }
      ]
    }
  }
]
```

install manifest
```bash
$ npm i react-helmet gatsby-plugin-react-helmet gatsby-plugin-manifest gatsby-plugin-sitemap gatsby-plugin-offline
```

create config/site.js
```js
module.exports = {
  pathPrefix: '/',
  title: 'PrismaCode', // タイトル
  titleAlt: 'PrismaCode', // JSONLDのためのタイトル
  description: 'Notes on programming.',
  url: 'https://taroosg.io', // スラッシュなしのサイトURL
  siteURL: 'https://taroosg.io/', // スラッシュありのサイトURL
  siteLanguage: 'ja', // HTMLの言語（ここでは日本語）
  logo: 'src/images/logo.png',
  banner: 'src/images/banner.png',
  favicon: 'src/images/favicon.png', // ファビコン
  shortName: 'CodeSite', // サイトの略称、12文字以下
  author: 'taroosg', // schemaORGJSONLDの作成者
  themeColor: '#3e62ad',
  backgroundColor: '#281a14',
  twitter: '@taro_osg', // TwitterのID
};
```

update gatsby-config.js
```js
const config = require('./config/site');
...
  siteMetadata: config,
...
```

create src/components/SEO.jsx
```jsx
import React, { Component } from 'react'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'

const SEO = ({ title, desc, banner, pathname, article }) => (
  <StaticQuery
    query={query}
    render={({
      site: {
        buildTime,
        siteMetadata: {
          defaultTitle,
          titleAlt,
          shortName,
          author,
          siteLanguage,
          logo,
          siteUrl,
          pathPrefix,
          defaultDescription,
          defaultBanner,
          twitter,
        },
      },
    }) => {
      const seo = {
        title: title || defaultTitle,
        description: defaultDescription || desc,
        image: `${siteUrl}${banner || defaultBanner}`,
        url: `${siteUrl}${pathname || '/'}`,
      };
    }}
  />
);

export default SEO

SEO.propTypes = {
  title: PropTypes.string,
  desc: PropTypes.string,
  banner: PropTypes.string,
  pathname: PropTypes.string,
  article: PropTypes.bool,
};

SEO.defaultProps = {
  title: null,
  desc: null,
  banner: null,
  pathname: null,
  article: false,
};

const query = graphql`
  query SEO {
    site {
      buildTime
      siteMetadata {
        defaultTitle: title
        titleAlt
        shortName
        author
        siteLanguage
        logo
        siteUrl: url
        pathPrefix
        defaultDescription: description
        defaultBanner: banner
        twitter
      }
    }
  }
`;
```

update src/components/SEO.jsx

```jsx
...
              '@id': siteUrl,
            },
          },
        ];
      }
      return (
        <>
          <Helmet title={seo.title}>
            <html lang={siteLanguage} />
            <meta name="description" content={seo.description} />
            <meta name="image" content={seo.image} />
            <meta name="apple-mobile-web-app-title" content={shortName} />
            <meta name="application-name" content={shortName} />
            <script type="application/ld+json">{JSON.stringify(schemaOrgJSONLD)}</script>

            {/* OpenGraph  */}
            <meta property="og:url" content={seo.url} />
            <meta property="og:type" content={article ? 'article' : null} />
            <meta property="og:title" content={seo.title} />
            <meta property="og:description" content={seo.description} />
            <meta property="og:image" content={seo.image} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:creator" content={twitter} />
            <meta name="twitter:title" content={seo.title} />
            <meta name="twitter:description" content={seo.description} />
            <meta name="twitter:image" content={seo.image} />
            </Helmet>
        </>
      );
    }}
  />
);
...
```

update src/templates/post.jsx
```jsx
...
  return (
    <Layout>
      <SEO
        title={title}
        description={post.frontmatter.description || post.excerpt || ' '}
        image={image}
        pathname={post.frontmatter.path}
        article
      />
...
```

大体完成