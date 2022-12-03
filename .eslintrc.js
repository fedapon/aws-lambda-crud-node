module.exports = {
  plugins: ['prettier'],
  extends: ['@serverless/eslint-config/node'],
  root: true,
  env: { node: true, jest: true },
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'strict': 'off',
    'no-console': 'off',
  },
};
