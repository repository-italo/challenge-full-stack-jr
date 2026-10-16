export interface CanilData {
    id: number;
    numero: number;
    createdAt: Date;
    updatedAt: Date;
}

export class CanilEntity {
    private constructor(
        readonly id: number,
        readonly numero: number,
        readonly createdAt: Date,
        readonly updatedAt: Date,
    ) {}

    static restore(data: CanilData) {
        return new CanilEntity(data.id, data.numero, data.createdAt, data.updatedAt);
    }
}
