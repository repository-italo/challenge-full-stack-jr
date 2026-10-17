'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();
        const canis = Array.from({ length: 15 }, (_, i) => ({
            numero: i + 1,
            valor_diario: 70,
            createdAt: now,
            updatedAt: now,
        }));
        await queryInterface.bulkInsert('canil', canis);
        await queryInterface.bulkInsert('dono', [
            {
                nome: 'Augusto',
                telefone: null,
                createdAt: now,
                updatedAt: now,
            },
        ]);
        const [donoRows] = await queryInterface.sequelize.query("SELECT id FROM dono WHERE nome = 'Augusto' LIMIT 1");
        const donoId = donoRows[0].id;
        await queryInterface.bulkInsert('pet', [
            {
                nome: 'Rex',
                raca: 'Indefinida',
                id_dono: donoId,
                createdAt: now,
                updatedAt: now,
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query("DELETE FROM pet WHERE nome = 'Rex'");
        await queryInterface.sequelize.query("DELETE FROM dono WHERE nome = 'Augusto'");
        await queryInterface.sequelize.query('DELETE FROM canil WHERE numero >= 1 AND numero <= 15');
    },
};
