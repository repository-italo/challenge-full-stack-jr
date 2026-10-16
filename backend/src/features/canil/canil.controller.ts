import type { Request, Response } from 'express';
import { NotFoundError } from '@/shared/errors/index.js';
import type { RemoveUndefined } from '@/shared/types/index.js';
import type { UpdateCanilRequest } from './canil.schemas.js';
import type { CanilService } from './canil.service.js';

export class CanilController {
    constructor(private readonly canilService: CanilService) {}

    async getAll(_req: Request, res: Response): Promise<void> {
        const canils = await this.canilService.getAllCanis();
        res.status(200).json(
            canils.map((canil) => ({
                id: canil.id,
                numero: canil.numero,
                valor_diario: canil.valor_diario,
            })),
        );
    }

    async getById(_req: Request, res: Response): Promise<void> {
        const { id } = res.locals.params as { id: number };
        const canil = await this.canilService.getCanilById(id);
        if (!canil) {
            throw new NotFoundError(`Canil with id ${id} not found`);
        }
        res.status(200).json({
            id: canil.id,
            numero: canil.numero,
            valor_diario: canil.valor_diario,
        });
    }

    async create(_req: Request, res: Response): Promise<void> {
        const { numero, valor_diario } = res.locals.body as { numero: number; valor_diario: number };
        const canil = await this.canilService.createCanil({ numero, valor_diario });
        res.status(201).json({
            id: canil.id,
            numero: canil.numero,
            valor_diario: canil.valor_diario,
        });
    }

    async update(_req: Request, res: Response): Promise<void> {
        const { id } = res.locals.params as { id: number };
        const data = res.locals.body as RemoveUndefined<UpdateCanilRequest>;
        const canil = await this.canilService.updateCanil(id, data);
        if (!canil) {
            throw new NotFoundError(`Canil with id ${id} not found`);
        }
        res.status(200).json({
            id: canil.id,
            numero: canil.numero,
            valor_diario: canil.valor_diario,
        });
    }

    async delete(_req: Request, res: Response): Promise<void> {
        const { id } = res.locals.params as { id: number };
        const deleted = await this.canilService.deleteCanil(id);
        if (!deleted) {
            throw new NotFoundError(`Canil with id ${id} not found`);
        }
        res.status(204).send();
    }
}
