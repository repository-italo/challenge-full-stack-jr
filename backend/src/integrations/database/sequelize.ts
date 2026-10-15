import process from 'node:process';
import { Sequelize } from 'sequelize';
import z from 'zod';

const envVarSchema = z.object({
    host: z.string(),
    port: z.coerce.number(),
    username: z.string(),
    password: z.string(),
});

let connection: Sequelize | null = null;

export async function initConnection(): Promise<Sequelize> {
    if (connection) {
        return connection;
    }

    const credentials = envVarSchema.parse({
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
    });

    connection = new Sequelize({
        dialect: 'mysql',
        host: credentials.host,
        port: credentials.port,
        username: credentials.username,
        password: credentials.password,
        database: 'database_petzin',
    });

    await connection.authenticate();
    return connection;
}
