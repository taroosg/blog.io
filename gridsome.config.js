module.exports = {
    siteName: `無念無想`,
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
