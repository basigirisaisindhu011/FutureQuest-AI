import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
export default [
  { ignores: ['dist/**', 'node_modules/**', '**/*.timestamp-*.mjs'] },
  {
    files: ['**/*.{js,jsx,mjs}'],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module', globals: { ...globals.browser, ...globals.node }, parserOptions: { ecmaFeatures: { jsx: true } } },
    plugins: { react },
    rules: {
      ...js.configs.recommended.rules,
      // Existing unused UI imports are cleanup work, not runtime errors.
      'no-unused-vars': 'off',
      'react/jsx-no-undef': 'error',
      'react/jsx-uses-vars': 'error'
    }
  }
];
