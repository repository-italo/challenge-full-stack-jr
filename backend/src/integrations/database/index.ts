import { Canil, Dono, initializeModels, Pet, Reserva, setupAssociations } from './models/index.js';
import { initConnection } from './sequelize.js';

let models: ReturnType<typeof getModels> | null = null;

function getModels() {
    return {
        Canil,
        Dono,
        Pet,
        Reserva,
    };
}

export async function initDatabase() {
    const sequelize = await initConnection();
    initializeModels(sequelize);
    setupAssociations();

    models = getModels();

    return models;
}

export function getCachedModels() {
    if (!models) {
        throw new Error('Models not initialized. Call initDatabase() first.');
    }
    return models;
}
