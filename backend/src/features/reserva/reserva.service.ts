import type { ReservaEntity } from './reserva.entity.js';
import type { ReservaRepository } from './reserva.repository.js';

export class ReservaService {
    constructor(private readonly reservaRepository: ReservaRepository) {}

    async getAllReservas(): Promise<ReservaEntity[]> {
        return this.reservaRepository.findAll();
    }

    async getReservaById(id: number): Promise<ReservaEntity | null> {
        return this.reservaRepository.findById(id);
    }

    async createReserva(data: {
        id_canil: number;
        id_pet: number;
        data_entrada: Date;
        data_saida: Date;
    }): Promise<ReservaEntity> {
        return this.reservaRepository.create(data);
    }

    async updateReserva(
        id: number,
        data: { id_canil?: number; id_pet?: number; data_entrada?: Date; data_saida?: Date },
    ): Promise<ReservaEntity | null> {
        return this.reservaRepository.update(id, data);
    }

    async deleteReserva(id: number): Promise<boolean> {
        return this.reservaRepository.delete(id);
    }
}
