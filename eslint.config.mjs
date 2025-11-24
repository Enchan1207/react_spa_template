// @ts-check
// NOTE: プラグインの命名は eslint-plugin を削ったlowerCamelCase
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import * as importPlugin from 'eslint-plugin-import';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';


export default defineConfig(
    // MARK: - Base configurations

    // global ignore
    {
        ignores: ['**/dist', '**/node_modules', "template"],
    },

    // MARK: - Shared configurations
    eslint.configs.recommended,
    tseslint.configs.strict,

    // configurations for TypeScript with type checking
    // based on: https://typescript-eslint.io/getting-started/typed-linting
    {
        name: 'source',
        files: ['**/*.ts'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: globals.node,
            parser: tseslint.parser,
            parserOptions: { project: true },
        },
        extends: [tseslint.configs.strictTypeChecked],
    },

    // configurations for config files
    {
        name: 'config files',
        files: ['**/*.config.{j,mj,t.mt}s'],
        languageOptions: {
            globals: globals.node,
        },
    },

    // MARK: - Plugin settings

    {
        name: 'import rules',
        plugins: {
            import: importPlugin,
            'simple-import-sort': simpleImportSortPlugin,
            'unused-import': unusedImportsPlugin,
        },
        rules: {
            'import/first': 'error',
            'import/newline-after-import': 'error',
            'import/no-duplicates': 'error',
            'import/consistent-type-specifier-style': 'error',
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
            'unused-import/no-unused-imports': 'error',
            '@typescript-eslint/no-unused-vars': 'off',
            'unused-import/no-unused-vars': [
                'error',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],
        },
    },

    {
        name: 'common rules',
        files: ['**/*.{ts,tsx}'],
        rules: {
            eqeqeq: ['error', 'always'],
            'no-useless-rename': 'error',
            '@typescript-eslint/restrict-template-expressions': [
                'error',
                { allowNumber: true },
            ],
            '@typescript-eslint/consistent-type-imports': [
                'error',
                { prefer: 'type-imports' },
            ],
        },
    },

    prettierConfig,
)
