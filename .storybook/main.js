const merge = require('webpack-merge');

const getOverrideWebpackConfig = require('./webpack.override');

module.exports = {
    stories: ['../stories/**/*.stories.jsx'],
    addons: ['@storybook/addon-actions', '@storybook/addon-links'],
    webpackFinal: async (config, storybookOptions) => {
        const overrideWebpackConfig = await getOverrideWebpackConfig(storybookOptions);
        const mergedConfig = merge(config, overrideWebpackConfig);
        // console.dir(mergedConfig, { depth: null })
        return mergedConfig;
    },
};
