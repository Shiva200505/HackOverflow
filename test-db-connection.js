/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
    try {
        console.log('Testing database connection...');
        await prisma.$connect();
        console.log('✅ Database connection successful!');

        // Try a simple query
        const result = await prisma.$queryRaw`SELECT NOW()`;
        console.log('✅ Query executed successfully:', result);

        await prisma.$disconnect();
        console.log('✅ Disconnected successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database connection failed:');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('\nFull error:', error);
        process.exit(1);
    }
}

testConnection();
