module.exports = {
    recursive: true,
    require: ['@babel/register'],
    exit: true,
    timeout: 3 * 1000,
    colors: true,
    extension: 'js',
    spec: ['./test/**/*.test.js'],
};
