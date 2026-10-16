export interface ReservaData {
    id: number;
    id_canil: number;
    id_pet: number;
    data_entrada: Date;
    data_saida: Date;
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
            data.createdAt,
            data.updatedAt,
        );
    }
}
