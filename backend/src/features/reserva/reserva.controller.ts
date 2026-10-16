import type { Request, Response } from 'express';
import type { RemoveUndefined } from '@/shared/types/index.js';
import type { CreateReservaRequest, ReservaParams, UpdateReservaRequest } from './reserva.schemas.js';
import type { ReservaService } from './reserva.service.js';

export class ReservaController {
    constructor(private readonly reservaService: ReservaService) {}

    async getAll(_req: Request, res: Response): Promise<void> {
        try {
            const reservas = await this.reservaService.getAllReservas();
            res.status(200).json(reservas);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getById(_req: Request, res: Response): Promise<void> {
        try {
            const { id } = res.locals.params as ReservaParams;
            const reserva = await this.reservaService.getReservaById(id);
            if (!reserva) {
                res.status(404).json({ error: 'Reserva not found' });
                return;
            }
            res.status(200).json(reserva);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async create(_req: Request, res: Response): Promise<void> {
        try {
            const data = res.locals.body as CreateReservaRequest;
            const reserva = await this.reservaService.createReserva(data);
            res.status(201).json(reserva);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async update(_req: Request, res: Response): Promise<void> {
        try {
            const { id } = res.locals.params as ReservaParams;
            const data = res.locals.body as RemoveUndefined<UpdateReservaRequest>;
            const reserva = await this.reservaService.updateReserva(id, data);
            if (!reserva) {
                res.status(404).json({ error: 'Reserva not found' });
                return;
            }
            res.status(200).json(reserva);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async delete(_req: Request, res: Response): Promise<void> {
        try {
            const { id } = res.locals.params as ReservaParams;
            const deleted = await this.reservaService.deleteReserva(id);
            if (!deleted) {
                res.status(404).json({ error: 'Reserva not found' });
                return;
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
