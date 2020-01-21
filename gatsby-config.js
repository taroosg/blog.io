const config = require('./config/site');

module.exports = {
  siteMetadata: config,
  plugins: [
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
        head: true,
      }
    },
    // {
    //   resolve: 'gatsby-plugin-google-adsense',
    //   options: {
    //     publisherId: process.env.GOOGLE_ADSENSE_ID,
    //   },
    // },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: config.url,
        sitemap: `${config.url}/sitemap.xml`,
        policy: [{ userAgent: '*', allow: '/' }]
      }
    },
    'gatsby-plugin-emotion',
    'gatsby-plugin-material-ui',
    'gatsby-plugin-catch-links',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-react-helmet',
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
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              showLineNumbers: true,
            },
          }
        ]
      }
    },
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: config.title,
        short_name: config.shortName,
        description: config.description,
        start_url: config.pathPrefix,
        background_color: config.backgroundColor,
        theme_color: config.themeColor,
        display: 'standalone',
        icon: config.favicon,
      },
    },
    'gatsby-plugin-offline',
    // {
    //   resolve: "gatsby-plugin-purgecss",
    //   options: {
    //     content: [
    //       require("path").join(
    //         process.cwd(),
    //         "src/**/!(*.d).{js,jsx,ts,tsx,md,mdx}"
    //       ),
    //     ],
    //     printRejected: true,
    //     develop: true,
    //     // tailwind: true,
    //     whitelist: ["emoji"],
    //     ignore: ['/ignored.css', 'prismjs/', 'docsearch.js/'],
    //   },
    // },
  ]
}