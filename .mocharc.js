const configs = {
    require: ['@babel/register'],
    recursive: true,
    spec: ['./test/**/*.test.js'],
    extension: ['js', 'ts'],
    exit: true,
    timeout: 3 * 1000,
    colors: true,
};

process.env.VSCODE_TEST === '1' && delete configs.spec;

module.exports = configs;
