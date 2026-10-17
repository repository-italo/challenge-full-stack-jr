import { ConflictError, NotFoundError } from '@/shared/errors/index.js';
import type { CanilRepository } from '../canil/canil.repository.js';
import type { ReservaRepository } from './reserva.repository.js';

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
                throw new ConflictError(`Esse pet tem uma reserva conflitando durante esse período`);
            }
        }
    }

    async validateFamilyPetsInCanil(
        donoId: number,
        canilId: number,
        dataEntrada: Date,
        dataSaida: Date,
    ): Promise<void> {
        const overlappingReservas = await this.reservaRepository.findOverlappingByCanilAndDonoInDateRange(
            canilId,
            donoId,
            dataEntrada,
            dataSaida,
        );

        const uniquePets = new Set(overlappingReservas.map((r) => r.id_pet));

        if (uniquePets.size >= 2) {
            throw new ConflictError(`Dono já tem 2 cachorros no canil ${canilId}`);
        }
    }

    async calculateValorTotalPago(canilId: number, dataEntrada: Date, dataSaida: Date): Promise<number> {
        const canil = await this.canilRepository.findById(canilId);
        if (!canil) {
            throw new NotFoundError(`Canil com id ${canilId} não encontrado`);
        }

        const days = Math.ceil((dataSaida.getTime() - dataEntrada.getTime()) / (1000 * 60 * 60 * 24)) + 1;
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
