export default {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    'sourceType': 'module'
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-native',
    'prettier',
    'import'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-native/all',
    'plugin:react-hooks/recommended',
    'prettier',
    'plugin:import/recommended'
  ],
  rules: { 
    'no-console': 1
  },
  settings: {
    'import/resolver': {
      'typescript': {
        'project': './tsconfig.json'
      }
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    }
  }
};
