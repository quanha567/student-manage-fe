module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        'eslint:recommended',
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/strict-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
    ],
    ignorePatterns: [
        'dist',
        '.eslintrc.cjs',
        'node_modules',
        'main.tsx',
        'tailwind.config.js',
        'postcss.config.js',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh', 'perfectionist'],
    rules: {
        'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true },
        ],
        'perfectionist/sort-enums': [
            'error',
            {
                type: 'natural',
                order: 'asc',
            },
        ],
        'perfectionist/sort-exports': [
            'error',
            {
                type: 'natural',
                order: 'asc',
            },
        ],
        'perfectionist/sort-imports': [
            'error',
            {
                type: 'natural',
                order: 'asc',
                groups: [
                    'type',
                    'react',
                    'nanostores',
                    ['builtin', 'external'],
                    'antd',
                    'internal-type',
                    'internal',
                    ['parent-type', 'sibling-type', 'index-type'],
                    ['parent', 'sibling', 'index'],
                    'side-effect',
                    'style',
                    'object',
                    'unknown',
                ],
                'custom-groups': {
                    value: {
                        react: ['react', 'react-*'],
                        antd: ['antd', 'antd/**', '@ant-**'],
                        nanostores: '@nanostores/**',
                    },
                    type: {
                        react: 'react',
                    },
                },
                'newlines-between': 'always',
                'internal-pattern': ['@/**'],
            },
        ],
        'perfectionist/sort-interfaces': [
            'error',
            {
                type: 'natural',
                order: 'asc',
            },
        ],
        'perfectionist/sort-named-exports': [
            'error',
            {
                type: 'natural',
                order: 'asc',
            },
        ],
        'perfectionist/sort-named-imports': [
            'error',
            {
                type: 'natural',
                order: 'asc',
            },
        ],
        '@typescript-eslint/no-misused-promises': [
            'error',
            {
                checksVoidReturn: false,
            },
        ],
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        // 'no-console': 'off',
    },
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: [
            './tsconfig.json',
            './tsconfig.node.json',
            './tsconfig.app.json',
        ],
        tsconfigRootDir: __dirname,
    },
}
