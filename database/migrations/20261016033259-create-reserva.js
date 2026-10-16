'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('reserva', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            id_canil: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'canil', key: 'id' },
            },
            id_pet: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'pet', key: 'id' },
            },
            data_entrada: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            data_saida: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('reserva');
    },
};
