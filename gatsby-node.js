const path = require('path')

exports.createPages = (({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const postTemplate = path.resolve('src/templates/post.jsx')
    const tagPage = path.resolve('src/pages/tags.jsx');
    const tagPosts = path.resolve('src/templates/tag.jsx');

    resolve(
      graphql(
        `
          query {
            allMarkdownRemark  (
              sort: {order: DESC, fields: [frontmatter___date]}
            ){
              edges {
                node {
                  id
                  frontmatter {
                    title
                    description
                    date(formatString: "DD MMMM, YYYY")
                    path
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

        // createPage({
        //   path: '/tags/',
        //   component: tagPage,
        //   context: {
        //     tags: tags.sort(),
        //   },
        // });

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
      })
    )
  })
})