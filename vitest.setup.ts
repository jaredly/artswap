import '@testing-library/jest-dom';

// Use in-memory SQLite for tests
if (process.env.VITEST) {
    process.env.DATABASE_URL = 'file:memory:?cache=shared';
    // Run migrations before tests
    // const {execSync} = require('child_process');
    // execSync('npx prisma migrate deploy', {stdio: 'inherit'});
}
