import { DataTypes, Model, type Sequelize } from 'sequelize';

export class Pet extends Model {
    declare id: number;
    declare nome: string;
    declare raca: string;
    declare id_dono: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static initialize(sequelize: Sequelize) {
        Pet.init(
            {
                id: {
                    primaryKey: true,
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                },
                nome: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                id_dono: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                raca: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                createdAt: {
                    type: DataTypes.DATE(3),
                    allowNull: false,
                },
                updatedAt: {
                    type: DataTypes.DATE(3),
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: true,
                modelName: 'Pet',
                tableName: 'pet',
            },
        );
    }
}
