module.exports = {
    siteName: `taroosg.io`,
    titleTemplate: `%s - Gridsome`,

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
