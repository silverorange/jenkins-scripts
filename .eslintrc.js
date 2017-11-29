module.exports = {
  extends: ['airbnb', 'prettier', 'prettier/react'],
  plugins: ['prettier'],
  env: {
    node: true,
    jest: true,
  },
  rules: {
    'no-console': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.js'] }],
    'prettier/prettier': ['error', { singleQuote: true }],
  },
};
