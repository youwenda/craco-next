module.exports = {
  'plugins': ['jest'],
  'env': {
    'browser': true,
    'es2021': true,
    'node': true,
    'jest/globals': true,
  },
  'extends': 'eslint:recommended',
  'parser': '@babel/eslint-parser',
  'parserOptions': {
    requireConfigFile: false,
    'ecmaVersion': 2018,
    'sourceType': 'module',
  },
  'rules': {
    'semi': 'error',
    'no-unused-vars': 'warn',
    'no-useless-escape': 'warn',
    'no-cond-assign': 'off',
    'no-extra-semi': 'error',
    'keyword-spacing': 'error',
  },
};
