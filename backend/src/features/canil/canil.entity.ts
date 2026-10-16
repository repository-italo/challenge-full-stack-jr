export interface CanilData {
    id: number;
    numero: number;
    valor_diario: number;
    createdAt: Date;
    updatedAt: Date;
}

export class CanilEntity {
    private constructor(
        readonly id: number,
        readonly numero: number,
        readonly valor_diario: number,
        readonly createdAt: Date,
        readonly updatedAt: Date,
    ) {}

    static restore(data: CanilData) {
        return new CanilEntity(data.id, data.numero, data.valor_diario, data.createdAt, data.updatedAt);
    }
}
