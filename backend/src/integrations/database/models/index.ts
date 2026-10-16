import type { Sequelize } from 'sequelize';
import { Canil } from './canil.js';
import { Dono } from './dono.js';
import { Pet } from './pet.js';
import { Reserva } from './reserva.js';

export function initializeModels(sequelize: Sequelize) {
    Canil.initialize(sequelize);
    Dono.initialize(sequelize);
    Pet.initialize(sequelize);
    Reserva.initialize(sequelize);
}

export function setupAssociations() {
    Dono.hasMany(Pet, { foreignKey: 'id_dono', as: 'pet' });
    Pet.belongsTo(Dono, { foreignKey: 'id_dono', as: 'dono' });

    Canil.hasMany(Reserva, { foreignKey: 'id_canil', as: 'reserva' });
    Reserva.belongsTo(Canil, { foreignKey: 'id_canil', as: 'canil' });

    Pet.hasMany(Reserva, { foreignKey: 'id_pet', as: 'reserva' });
    Reserva.belongsTo(Pet, { foreignKey: 'id_pet', as: 'pet' });
}

export { Canil, Dono, Pet, Reserva };
