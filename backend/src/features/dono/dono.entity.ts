export interface DonoData {
    id: number;
    nome: string;
    telefone: string;
    createdAt: Date;
    updatedAt: Date;
}

export class DonoEntity {
    private constructor(
        readonly id: number,
        readonly nome: string,
        readonly telefone: string,
        readonly createdAt: Date,
        readonly updatedAt: Date,
    ) {}

    static restore(data: DonoData) {
        return new DonoEntity(data.id, data.nome, data.telefone, data.createdAt, data.updatedAt);
    }
}
