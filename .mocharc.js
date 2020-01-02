module.exports = {
    require: ['@babel/register'],
    recursive: true,
    spec: ['./test/**/*.test.js'],
    extension: 'js',
    exit: true,
    timeout: 3 * 1000,
    colors: true,
};
