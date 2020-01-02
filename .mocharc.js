module.exports = {
    require: ['@babel/register'],
    recursive: true,
    spec: ['./test/**/*.test.js'],
    extension: ['js', 'ts'],
    exit: true,
    timeout: 3 * 1000,
    colors: true,
};
