import { CanilRepository } from '../canil/canil.repository.js';
import { ReservaRepository } from './reserva.repository.js';
import { ConflictError } from '@/shared/errors/index.js';

export class ReservaValidator {
    constructor(
        private readonly canilRepository: CanilRepository,
        private readonly reservaRepository: ReservaRepository,
    ) {}

    async validateNoConflictingReservations(
        petId: number,
        dataEntrada: Date,
        dataSaida: Date,
        excludeReservaId?: number,
    ): Promise<void> {
        const existingReservas = await this.reservaRepository.findByPetId(petId);

        for (const reserva of existingReservas) {
            if (excludeReservaId && reserva.id === excludeReservaId) {
                continue;
            }

            const hasConflict = dataEntrada < reserva.data_saida && dataSaida > reserva.data_entrada;

            if (hasConflict) {
                throw new Error(`Pet with id ${petId} has a conflicting reservation during this period`);
            }
        }
    }

    async validateFamilyPetsInCanil(donoId: number, canilId: number): Promise<void> {
        const activeReservas = await this.reservaRepository.findActiveByCanilAndDono(canilId, donoId);

        if (activeReservas.length >= 2) {
            throw new Error(`Owner already has 2 dogs in kennel ${canilId}`);
        }
    }

    async calculateValorTotalPago(canilId: number, dataEntrada: Date, dataSaida: Date): Promise<number> {
        const canil = await this.canilRepository.findById(canilId);
        if (!canil) {
            throw new Error(`Kennel with id ${canilId} not found`);
        }

        const days = Math.ceil((dataSaida.getTime() - dataEntrada.getTime()) / (1000 * 60 * 60 * 24));
        return days * Number(canil.valor_diario);
    }

    async validateValorTotalPago(
        canilId: number,
        dataEntrada: Date,
        dataSaida: Date,
        providedValue: number,
    ): Promise<void> {
        const calculatedValue = await this.calculateValorTotalPago(canilId, dataEntrada, dataSaida);

        if (Math.abs(providedValue - calculatedValue) > 0.01) {
            throw new ConflictError(
                `Valor total pago mismatch. Expected: ${calculatedValue}, Received: ${providedValue}`,
            );
        }
    }
}
