module.exports = async function getOverrideWebpackConfig(storybookOptions) {
    return {
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: ['style-loader', 'css-loader', 'sass-loader'],
                },
            ],
        },
    };
};
