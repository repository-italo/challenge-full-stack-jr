export interface ReservaData {
    id: number;
    id_canil: number;
    id_pet: number;
    data_entrada: Date;
    data_saida: Date;
    valor_total_pago: number;
    createdAt: Date;
    updatedAt: Date;
}

export class ReservaEntity {
    private constructor(
        readonly id: number,
        readonly id_canil: number,
        readonly id_pet: number,
        readonly data_entrada: Date,
        readonly data_saida: Date,
        readonly valor_total_pago: number,
        readonly createdAt: Date,
        readonly updatedAt: Date,
    ) {}

    static restore(data: ReservaData) {
        return new ReservaEntity(
            data.id,
            data.id_canil,
            data.id_pet,
            data.data_entrada,
            data.data_saida,
            data.valor_total_pago,
            data.createdAt,
            data.updatedAt,
        );
    }
}
