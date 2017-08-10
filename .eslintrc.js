module.exports = {
  extends: 'airbnb',
  env: {
    browser: false,
    node: true,
    es6: true,
  },
  rules: {
    'no-console': 'off',
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'never',
        exports: 'never',
        functions: 'never',
      },
    ],
  },
};
