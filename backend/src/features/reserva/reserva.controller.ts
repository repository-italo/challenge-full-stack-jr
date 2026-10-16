import type { Request, Response } from 'express';
import { NotFoundError } from '@/shared/errors/index.js';
import type { RemoveUndefined } from '@/shared/types/index.js';
import type { CreateReservaRequest, ReservaParams, UpdateReservaRequest } from './reserva.schemas.js';
import type { ReservaService } from './reserva.service.js';

export class ReservaController {
    constructor(private readonly reservaService: ReservaService) {}

    async getAll(_req: Request, res: Response): Promise<void> {
        const reservas = await this.reservaService.getAllReservas();
        res.status(200).json(
            reservas.map((reserva) => ({
                id: reserva.id,
                id_canil: reserva.id_canil,
                id_pet: reserva.id_pet,
                data_entrada: reserva.data_entrada,
                data_saida: reserva.data_saida,
                valor_total_pago: reserva.valor_total_pago,
            })),
        );
    }

    async getById(_req: Request, res: Response): Promise<void> {
        const { id } = res.locals.params as ReservaParams;
        const reserva = await this.reservaService.getReservaById(id);
        if (!reserva) {
            throw new NotFoundError(`Reserva with id ${id} not found`);
        }
        res.status(200).json({
            id: reserva.id,
            id_canil: reserva.id_canil,
            id_pet: reserva.id_pet,
            data_entrada: reserva.data_entrada,
            data_saida: reserva.data_saida,
            valor_total_pago: reserva.valor_total_pago,
        });
    }

    async create(_req: Request, res: Response): Promise<void> {
        const data = res.locals.body as CreateReservaRequest;
        const reserva = await this.reservaService.createReserva(data);
        res.status(201).json({
            id: reserva.id,
            id_canil: reserva.id_canil,
            id_pet: reserva.id_pet,
            data_entrada: reserva.data_entrada,
            data_saida: reserva.data_saida,
            valor_total_pago: reserva.valor_total_pago,
        });
    }

    async update(_req: Request, res: Response): Promise<void> {
        const { id } = res.locals.params as ReservaParams;
        const data = res.locals.body as RemoveUndefined<UpdateReservaRequest>;
        const reserva = await this.reservaService.updateReserva(id, data as any);
        if (!reserva) {
            throw new NotFoundError(`Reserva with id ${id} not found`);
        }
        res.status(200).json({
            id: reserva.id,
            id_canil: reserva.id_canil,
            id_pet: reserva.id_pet,
            data_entrada: reserva.data_entrada,
            data_saida: reserva.data_saida,
            valor_total_pago: reserva.valor_total_pago,
        });
    }

    async delete(_req: Request, res: Response): Promise<void> {
        const { id } = res.locals.params as ReservaParams;
        const deleted = await this.reservaService.deleteReserva(id);
        if (!deleted) {
            throw new NotFoundError(`Reserva with id ${id} not found`);
        }
        res.status(204).send();
    }
}
