import js from '@eslint/js';
import checkFile from 'eslint-plugin-check-file';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  extends: [js.configs.recommended, ...tseslint.configs.recommended],
  files: ['**/*.{ts,tsx}'],
  ignores: ['dist'],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
  },
  plugins: {
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
    'check-file': checkFile,
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    '@typescript-eslint/no-explicit-any': 'off',
    'check-file/filename-naming-convention': [
      'error',
      {
        '**/*.{ts,tsx}': 'KEBAB_CASE',
      },
      {
        // ignore the middle extensions of the filename to support filename like bable.config.js or smoke.spec.ts
        ignoreMiddleExtensions: true,
      },
    ],
    'check-file/folder-naming-convention': [
      'error',
      {
        // all folders within src (except __tests__)should be named in kebab-case
        'src/**/!(__tests__)': 'KEBAB_CASE',
      },
    ],
  },
});
