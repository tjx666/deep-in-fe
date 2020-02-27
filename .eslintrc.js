const OFF = 0;
const ERROR = 2;

module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true,
        mocha: true,
    },
    extends: [
        'airbnb-base',
        'plugin:eslint-comments/recommended',
        'plugin:node/recommended-script',
        'plugin:promise/recommended',
        'plugin:mocha/recommended',
        'prettier',
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: 'babel-eslint',
    rules: {
        'eslint-comments/disable-enable-pair': [ERROR, { allowWholeFile: true }],

        'mocha/no-mocha-arrows': OFF,

        'promise/always-return': OFF,

        'array-callback-return': OFF,
        'consistent-return': OFF,
        'func-names': OFF,
        'global-require': OFF,
        'import/newline-after-import': OFF,
        'import/no-dynamic-require': OFF,
        'lines-between-class-members': OFF,
        'max-classes-per-file': OFF,
        'no-bitwise': OFF,
        'no-caller': OFF,
        'no-console': OFF,
        'no-empty': OFF,
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
        'no-unused-vars': OFF,
    },
};
