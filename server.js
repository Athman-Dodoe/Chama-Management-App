const app = require('./src/app');
const env = require('./src/config/env');
const prisma = require('./src/config/database');

async function startServer() {
    try {
        await prisma.$connect();
        console.log('Connected to the database');
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        await prisma.$disconnect().catch(() => { });
        process.exit(1);
    }

    const server = app.listen(env.PORT, () => {
        console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });

    server.on('error', async (error) => {
        console.error('HTTP server error:', error);
        await prisma.$disconnect().catch(() => { });
        process.exit(1);
    });

    const shutdown = (signal) => {
        console.log(`${signal} received. Closing HTTP server...`);

        server.close(async () => {
            try {
                await prisma.$disconnect();
                console.log('Database connection closed. Exiting.');
                process.exit(0);
            } catch (error) {
                console.error('Error while disconnecting Prisma:', error);
                process.exit(1);
            }
        });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
}

startServer();