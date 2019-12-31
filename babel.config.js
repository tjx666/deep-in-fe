module.exports = function(api) {
    api.cache(true);

    const presets = [
        [
            '@babel/env',
            {
                useBuiltIns: 'usage',
                corejs: 3,
            },
        ],
        'power-assert',
    ];

    const plugins = [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-class-properties',
        '@babel/helper-create-class-features-plugin',
    ];

    return {
        presets,
        plugins,
        sourceMaps: true,
        retainLines: true,
    };
};
