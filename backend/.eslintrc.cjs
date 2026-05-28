module.exports = {
  root: true,
  extends: ['../.eslintrc.base.cjs'],
  parserOptions: {
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
  },
  env: {
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/no-empty-function': 'off',
  },
};
