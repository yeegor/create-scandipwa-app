/* eslint-disable no-param-reassign */

// Load the locale map with import injector
const addTemplatesMiddleware = (config) => {
    config.module.rules.push({
        test: /\.(p?html|php)$/,
        loader: require.resolve('../webpack-template-plugin-loader')
    });
};

module.exports = {
    plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
            addTemplatesMiddleware(webpackConfig);

            return webpackConfig;
        }
    }
};
