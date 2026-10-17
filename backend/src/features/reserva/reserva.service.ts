import type { CanilRepository } from '../canil/canil.repository.js';
import { PetRepository } from '../pet/pet.repository.js';
import type { ReservaEntity } from './reserva.entity.js';
import type { ReservaRepository } from './reserva.repository.js';
import type { GetReservasQuerySchema } from './reserva.schemas.js';
import { ReservaValidator } from './reserva.validator.js';

export class ReservaService {
    private validator: ReservaValidator;

    constructor(
        private readonly petRepository: PetRepository,
        private readonly reservaRepository: ReservaRepository,
        private readonly canilRepository: CanilRepository,
    ) {
        this.validator = new ReservaValidator(canilRepository, reservaRepository);
    }

    async getAllReservas(filters?: GetReservasQuerySchema): Promise<ReservaEntity[]> {
        return this.reservaRepository.findAll(filters);
    }

    async getReservaById(id: number): Promise<ReservaEntity | null> {
        return this.reservaRepository.findById(id);
    }

    async createReserva(data: {
        id_canil: number;
        id_pet: number;
        data_entrada: Date;
        data_saida: Date;
        valor_total_pago: number;
    }): Promise<ReservaEntity> {
        const pet = await this.petRepository.findById(data.id_pet);

        if (!pet) {
            throw new Error(`Pet with id ${data.id_pet} not found`);
        }

        await this.validator.validateNoConflictingReservations(data.id_pet, data.data_entrada, data.data_saida);
        await this.validator.validateFamilyPetsInCanil(pet.id_dono, data.id_canil);
        await this.validator.validateValorTotalPago(
            data.id_canil,
            data.data_entrada,
            data.data_saida,
            data.valor_total_pago,
        );

        return this.reservaRepository.create(data);
    }

    async updateReserva(
        id: number,
        data: { id_canil?: number; id_pet?: number; data_entrada?: Date; data_saida?: Date; valor_total_pago?: number },
    ): Promise<ReservaEntity | null> {
        const existingReserva = await this.reservaRepository.findById(id);
        if (!existingReserva) return null;

        const petId = data.id_pet ?? existingReserva.id_pet;
        const canilId = data.id_canil ?? existingReserva.id_canil;
        const dataEntrada = data.data_entrada ?? existingReserva.data_entrada;
        const dataSaida = data.data_saida ?? existingReserva.data_saida;

        const petRepository = new PetRepository();
        const pet = await petRepository.findById(petId);
        if (!pet) {
            throw new Error(`Pet with id ${petId} not found`);
        }

        await this.validator.validateNoConflictingReservations(petId, dataEntrada, dataSaida, id);
        await this.validator.validateFamilyPetsInCanil(pet.id_dono, canilId);

        let updateData: any = { ...data };
        if (data.id_canil || data.data_entrada || data.data_saida || data.valor_total_pago) {
            if (data.valor_total_pago) {
                await this.validator.validateValorTotalPago(canilId, dataEntrada, dataSaida, data.valor_total_pago);
            } else {
                const valorTotalPago = await this.validator.calculateValorTotalPago(canilId, dataEntrada, dataSaida);
                updateData = { ...updateData, valor_total_pago: valorTotalPago };
            }
        }

        return this.reservaRepository.update(id, updateData);
    }

    async deleteReserva(id: number): Promise<boolean> {
        return this.reservaRepository.delete(id);
    }
}
