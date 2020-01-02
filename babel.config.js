module.exports = function(api) {
    api.cache(true);

    const babelEnvPreset = [
        '@babel/env',
        {
            useBuiltIns: 'usage',
            corejs: 3,
        },
    ];

    const presets = ['@babel/preset-typescript', babelEnvPreset, 'power-assert'];
    const plugins = ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties'];

    return {
        presets,
        plugins,
        sourceMaps: 'inline',
        retainLines: true,
    };
};
