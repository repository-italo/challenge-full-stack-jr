import { getCachedModels } from '@/integrations/database/index.js';
import type { Reserva } from '@/integrations/database/models/reserva.js';
import { type ReservaData, ReservaEntity } from './reserva.entity.js';

export class ReservaRepository {
    private Reserva: typeof Reserva;

    constructor() {
        ({ Reserva: this.Reserva } = getCachedModels());
    }

    async findAll(): Promise<ReservaEntity[]> {
        const reservas = await this.Reserva.findAll();
        return reservas.map((reserva) => ReservaEntity.restore(reserva.toJSON() as ReservaData));
    }

    async findById(id: number): Promise<ReservaEntity | null> {
        const reserva = await this.Reserva.findByPk(id);
        if (!reserva) return null;
        return ReservaEntity.restore(reserva.toJSON() as ReservaData);
    }

    async findByPetId(petId: number): Promise<ReservaEntity[]> {
        const reservas = await this.Reserva.findAll({ where: { id_pet: petId } });
        return reservas.map((reserva) => ReservaEntity.restore(reserva.toJSON() as ReservaData));
    }

    async findActiveByCanilAndDono(canilId: number, donoId: number): Promise<ReservaEntity[]> {
        const { Pet } = getCachedModels();
        const reservas = await this.Reserva.findAll({
            where: { id_canil: canilId },
            include: [{ model: Pet, where: { id_dono: donoId } }],
        });
        return reservas.map((reserva) => ReservaEntity.restore(reserva.toJSON() as ReservaData));
    }

    async create(data: {
        id_canil: number;
        id_pet: number;
        data_entrada: Date;
        data_saida: Date;
        valor_total_pago: number;
    }): Promise<ReservaEntity> {
        const reserva = await this.Reserva.create(data);
        return ReservaEntity.restore(reserva.toJSON() as ReservaData);
    }

    async update(
        id: number,
        data: { id_canil?: number; id_pet?: number; data_entrada?: Date; data_saida?: Date; valor_total_pago?: number },
    ): Promise<ReservaEntity | null> {
        const reserva = await this.Reserva.findByPk(id);
        if (!reserva) return null;
        await reserva.update(data);
        return ReservaEntity.restore(reserva.toJSON() as ReservaData);
    }

    async delete(id: number): Promise<boolean> {
        const reserva = await this.Reserva.findByPk(id);
        if (!reserva) return false;
        await reserva.destroy();
        return true;
    }
}
