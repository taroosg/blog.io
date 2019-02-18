module.exports = {
    siteName: `monologue of a foreigner`,
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
