const configs = {
    require: ['intelli-espower-loader'],
    recursive: true,
    extension: ['js'],
    spec: ['./test/**/*.test.js'],
    exit: true,
    timeout: 3 * 1000,
    colors: true,
};

if (process.env.VSCODE_TEST === '1') {
    delete configs.spec;
}

if (process.env.VSCODE_DEBUG === '1') {
    configs.require.shift();
}

module.exports = configs;
