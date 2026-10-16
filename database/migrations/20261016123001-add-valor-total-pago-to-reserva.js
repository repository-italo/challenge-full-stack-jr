'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('reserva', 'valor_total_pago', {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('reserva', 'valor_total_pago');
    },
};
