module.exports = function(api) {
    api.cache(true);

    const presets = [
        [
            '@babel/env',
            {
                targets: {
                    browsers: ['last 2 version', 'Firefox ESR', '> 1%', 'ie >= 9'],
                },
                useBuiltIns: 'usage',
                corejs: 3,
            },
        ],
        'power-assert',
    ];
    const plugins = ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties'];

    return {
        presets,
        plugins,
        sourceMaps: true,
        retainLines: true,
    };
};
