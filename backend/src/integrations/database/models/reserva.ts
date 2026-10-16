import { DataTypes, Model, type Sequelize } from 'sequelize';

export class Reserva extends Model {
    declare id: number;
    declare id_canil: number;
    declare id_pet: number;
    declare data_entrada: Date;
    declare data_saida: Date;
    declare valor_total_pago: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static initialize(sequelize: Sequelize) {
        Reserva.init(
            {
                id: {
                    primaryKey: true,
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                },
                id_canil: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                id_pet: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                data_entrada: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                data_saida: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                valor_total_pago: {
                    type: DataTypes.DECIMAL(10, 2),
                    allowNull: false,
                    defaultValue: 0,
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
                modelName: 'Reserva',
                tableName: 'reserva',
            },
        );
    }
}
