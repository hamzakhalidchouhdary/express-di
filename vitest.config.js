import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        include: ['test/**/*.test.js'],
        env: {
            JWT_SECRET: 'test-secret',
        },
    },
});
