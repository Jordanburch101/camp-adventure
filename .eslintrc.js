module.exports = {
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@next/next/no-img-element': 'off',
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    'react/no-unescaped-entities': 'off',
    'no-redeclare': 'off'
  }
} 