import path from 'path';
import { fileURLToPath } from 'url';

import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const reactConfig = (appName) => ({
  files: [`apps/${appName}/**/*.{js,ts,jsx,tsx}`],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: { jsx: true },
      tsconfigRootDir: path.join(rootDir, `apps/${appName}`),
      project: [path.join(rootDir, `apps/${appName}/tsconfig.json`)],
    },
  },
  plugins: {
    react: reactPlugin,
    'react-hooks': reactHooksPlugin,
    'jsx-a11y': jsxA11yPlugin,
    '@next/next': nextPlugin,
  },
  rules: {
    ...reactPlugin.configs.recommended.rules,
    ...reactHooksPlugin.configs.recommended.rules,
    ...jsxA11yPlugin.configs.recommended.rules,
    ...nextPlugin.configs.recommended.rules,

    // Overrides
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'jsx-a11y/anchor-is-valid': 'off',
    '@next/next/no-html-link-for-pages': 'off',
  },
  settings: {
    react: { version: 'detect' },
  },
});

// Node.js config for services and libs
const nodeConfig = (dir) => ({
  files: [`${dir}/**/*.{js,ts}`],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      tsconfigRootDir: path.join(rootDir, dir),
      project: [path.join(rootDir, dir, 'tsconfig.json')],
    },
    globals: {
      process: true,
      require: true,
      module: true,
      __dirname: true,
      __filename: true,
    },
  },
  plugins: {
    '@typescript-eslint': tsPlugin,
  },
  rules: {
    ...tsPlugin.configs['recommended-type-checked'].rules,
    'no-undef': 'off',
  },
});

export default [
  {
    ignores: ['node_modules', 'dist', 'coverage', '.next', 'build'],
  },
  js.configs.recommended,

  // TypeScript base config
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      ...tsPlugin.configs.recommended.rules,
    },
  },

  // Apps (Next.js + React)
  reactConfig('web'),
  reactConfig('admin-panel'),
  reactConfig('seller-portal'),

  // Services (NestJS APIs)
  nodeConfig('services/api-gateway'),
  nodeConfig('services/svc-auth'),
  nodeConfig('services/svc-product'),
  nodeConfig('services/svc-order'),
  nodeConfig('services/svc-recommendation'),
  nodeConfig('services/svc-chat'),
  nodeConfig('services/svc-user'),
  nodeConfig('services/svc-notifications'),

  // Libs (shared TS libraries)
  nodeConfig('libs/ui'),
  nodeConfig('libs/shared-types'),
  nodeConfig('libs/kafka-client'),
  nodeConfig('libs/logging-lib'),
  nodeConfig('libs/prisma-client'),
  nodeConfig('libs/media-client'),

  // Test globals
  {
    files: [
      '**/*.test.{js,ts,jsx,tsx}',
      '**/*.spec.{js,ts,jsx,tsx}',
      '**/*.e2e-spec.{js,ts,jsx,tsx}',
      '**/__tests__/**/*.{js,ts,jsx,tsx}',
      '**/__specs__/**/*.{js,ts,jsx,tsx}',
    ],
    languageOptions: {
      globals: {
        describe: true,
        it: true,
        test: true,
        expect: true,
        beforeEach: true,
        afterEach: true,
        beforeAll: true,
        afterAll: true,
        jest: true,
      },
    },
  },
];
