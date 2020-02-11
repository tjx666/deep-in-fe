const OFF = 0;
const WARN = 1;

module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true,
        mocha: true,
    },
    extends: ['airbnb-base', 'prettier'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: 'babel-eslint',
    rules: {
        'array-callback-return': OFF,
        'consistent-return': OFF,
        'func-names': OFF,
        'global-require': OFF,
        'lines-between-class-members': OFF,
        'max-classes-per-file': OFF,
        'no-bitwise': OFF,
        'no-caller': OFF,
        'no-console': OFF,
        'no-eval': OFF,
        'no-extend-native': OFF,
        'no-multi-assign': OFF,
        'no-param-reassign': OFF,
        'no-plusplus': OFF,
        'no-proto': OFF,
        'no-prototype-builtins': OFF,
        'no-restricted-globals': OFF,
        'no-restricted-properties': OFF,
        'no-restricted-syntax': OFF,
        'no-shadow': OFF,
        'no-underscore-dangle': OFF,
        'no-unused-vars': WARN,
        'import/newline-after-import': OFF,
        'import/no-dynamic-require': OFF,
    },
};
