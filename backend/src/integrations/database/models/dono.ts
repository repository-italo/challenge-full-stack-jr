import { DataTypes, Model, type Sequelize } from 'sequelize';

export class Dono extends Model {
    declare id: number;
    declare nome: string;
    declare telefone: string;
    declare createdAt: Date;
    declare updatedAt: Date;

    static initialize(sequelize: Sequelize) {
        Dono.init(
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
                telefone: {
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
                modelName: 'Dono',
                tableName: 'dono',
            },
        );
    }
}
