export interface PetData {
    id: number;
    nome: string;
    raca: string;
    id_dono: number;
    createdAt: Date;
    updatedAt: Date;
}

export class PetEntity {
    private constructor(
        readonly id: number,
        readonly nome: string,
        readonly raca: string,
        readonly id_dono: number,
        readonly createdAt: Date,
        readonly updatedAt: Date,
    ) {}

    static restore(data: PetData) {
        return new PetEntity(data.id, data.nome, data.raca, data.id_dono, data.createdAt, data.updatedAt);
    }
}
