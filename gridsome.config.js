module.exports = {
    siteName: `unlimited code`,
    titleTemplate: `%s`,

    plugins: [
        {
            use: '@gridsome/source-filesystem',
            options: {
                path: 'blog/*.md',
                typeName: 'BlogPost',
                route: '/:slug'
            }
        }
    ]
}
