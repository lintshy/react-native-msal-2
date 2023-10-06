module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
    rules: {
        'no-unused-vars': 'warn', // off because it doesn't detect when a Type is used
        '@typescript-eslint/no-unused-vars': ['warn'], // actually works with Types
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off', // makes you define return types for all functions
        '@typescript-eslint/no-empty-function': 'off',
        curly: ['error', 'all'],

    }
};