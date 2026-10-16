import type { Request, Response } from 'express';
import { NotFoundError } from '@/shared/errors/index.js';
import type { RemoveUndefined } from '@/shared/types/index.js';
import type { CreateDonoRequest, DonoParams, UpdateDonoRequest } from './dono.schemas.js';
import type { DonoService } from './dono.service.js';

export class DonoController {
    constructor(private readonly donoService: DonoService) {}

    async getAll(_req: Request, res: Response): Promise<void> {
        const donos = await this.donoService.getAllDonos();
        res.status(200).json(donos);
    }

    async getById(_req: Request, res: Response): Promise<void> {
        const { id } = res.locals.params as DonoParams;
        const dono = await this.donoService.getDonoById(id);
        if (!dono) {
            throw new NotFoundError(`Dono with id ${id} not found`);
        }
        res.status(200).json(dono);
    }

    async create(_req: Request, res: Response): Promise<void> {
        const data = res.locals.body as CreateDonoRequest;
        const dono = await this.donoService.createDono(data);
        res.status(201).json(dono);
    }

    async update(_req: Request, res: Response): Promise<void> {
        const { id } = res.locals.params as DonoParams;
        const data = res.locals.body as RemoveUndefined<UpdateDonoRequest>;
        const dono = await this.donoService.updateDono(id, data);
        if (!dono) {
            throw new NotFoundError(`Dono with id ${id} not found`);
        }
        res.status(200).json(dono);
    }

    async delete(_req: Request, res: Response): Promise<void> {
        const { id } = res.locals.params as DonoParams;
        const deleted = await this.donoService.deleteDono(id);
        if (!deleted) {
            throw new NotFoundError(`Dono with id ${id} not found`);
        }
        res.status(204).send();
    }
}
