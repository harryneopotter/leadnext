import { execSync } from 'child_process';

if (!process.env.DATABASE_URL) {
  console.warn('⚠️  Skipping migrations: DATABASE_URL not set');
  process.exit(0);
}

try {
  console.log('🚀 Running Prisma migrations...');

  execSync('npx prisma migrate deploy', {
    cwd: process.cwd(),
    stdio: 'inherit',
  });

  console.log('✅ Prisma migrations completed successfully');
} catch (error) {
  console.error('❌ Migration error:', /** @type {Error} */ (error).message);
  process.exit(1);
}