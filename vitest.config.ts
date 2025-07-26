import {defineConfig} from 'vitest/config';

export default defineConfig({
    resolve: {
        alias: {
            '~': '/app',
        },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./vitest.setup.ts'],
    },
});
