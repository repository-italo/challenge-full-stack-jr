import type { Request, Response } from 'express';
import type { RemoveUndefined } from '@/shared/types/index.js';
import type { CreateDonoRequest, DonoParams, UpdateDonoRequest } from './dono.schemas.js';
import type { DonoService } from './dono.service.js';

export class DonoController {
    constructor(private readonly donoService: DonoService) {}

    async getAll(_req: Request, res: Response): Promise<void> {
        try {
            const donos = await this.donoService.getAllDonos();
            res.status(200).json(donos);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getById(_req: Request, res: Response): Promise<void> {
        try {
            const { id } = res.locals.params as DonoParams;
            const dono = await this.donoService.getDonoById(id);
            if (!dono) {
                res.status(404).json({ error: 'Dono not found' });
                return;
            }
            res.status(200).json(dono);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async create(_req: Request, res: Response): Promise<void> {
        try {
            const data = res.locals.body as CreateDonoRequest;
            const dono = await this.donoService.createDono(data);
            res.status(201).json(dono);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async update(_req: Request, res: Response): Promise<void> {
        try {
            const { id } = res.locals.params as DonoParams;
            const data = res.locals.body as RemoveUndefined<UpdateDonoRequest>;
            const dono = await this.donoService.updateDono(id, data);
            if (!dono) {
                res.status(404).json({ error: 'Dono not found' });
                return;
            }
            res.status(200).json(dono);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async delete(_req: Request, res: Response): Promise<void> {
        try {
            const { id } = res.locals.params as DonoParams;
            const deleted = await this.donoService.deleteDono(id);
            if (!deleted) {
                res.status(404).json({ error: 'Dono not found' });
                return;
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
