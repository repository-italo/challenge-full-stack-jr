import { DataTypes, Model, type Sequelize } from 'sequelize';

export class Canil extends Model {
    declare id: number;
    declare numero: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static initialize(sequelize: Sequelize) {
        Canil.init(
            {
                id: {
                    primaryKey: true,
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                },
                numero: {
                    type: DataTypes.INTEGER,
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
                modelName: 'Canil',
                tableName: 'canil',
            },
        );
    }
}
