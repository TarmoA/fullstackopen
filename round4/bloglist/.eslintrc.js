module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    jest: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {'no-underscore-dangle': 0}
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
  },
};
