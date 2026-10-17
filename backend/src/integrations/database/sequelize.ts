import process from 'node:process';
import { Sequelize } from 'sequelize';
import z from 'zod';

const envVarSchema = z.object({
    host: z.string(),
    port: z.coerce.number(),
    username: z.string(),
    password: z.string(),
    database: z.string(),
});

let connection: Sequelize | null = null;

export async function initConnection(): Promise<Sequelize> {
    if (connection) {
        return connection;
    }

    const credentials = envVarSchema.parse({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    connection = new Sequelize({
        dialect: 'mysql',
        host: credentials.host,
        port: credentials.port,
        username: credentials.username,
        password: credentials.password,
        database: credentials.database,
    });

    await connection.authenticate();
    return connection;
}
