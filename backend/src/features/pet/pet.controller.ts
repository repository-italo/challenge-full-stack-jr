import type { Request, Response } from 'express';
import { NotFoundError } from '@/shared/errors/index.js';
import type { RemoveUndefined } from '@/shared/types/index.js';
import type { CreatePetRequest, GetPetQuerySchema, PetParams, UpdatePetRequest } from './pet.schemas.js';
import type { PetService } from './pet.service.js';

export class PetController {
    constructor(private readonly petService: PetService) {}

    async getAll(_req: Request, res: Response): Promise<void> {
        const filters = res.locals.query as GetPetQuerySchema;
        const pets = await this.petService.getAllPets(filters);
        res.status(200).json(
            pets.map((pet) => ({
                id: pet.id,
                nome: pet.nome,
                raca: pet.raca,
                id_dono: pet.id_dono,
            })),
        );
    }

    async getById(_req: Request, res: Response): Promise<void> {
        const { id } = res.locals.params as PetParams;
        const pet = await this.petService.getPetById(id);
        if (!pet) {
            throw new NotFoundError(`Pet with id ${id} not found`);
        }
        res.status(200).json({
            id: pet.id,
            nome: pet.nome,
            raca: pet.raca,
            id_dono: pet.id_dono,
        });
    }

    async create(_req: Request, res: Response): Promise<void> {
        const data = res.locals.body as CreatePetRequest;
        const pet = await this.petService.createPet(data);
        res.status(201).json({
            id: pet.id,
            nome: pet.nome,
            raca: pet.raca,
            id_dono: pet.id_dono,
        });
    }

    async update(_req: Request, res: Response): Promise<void> {
        const { id } = res.locals.params as PetParams;
        const data = res.locals.body as RemoveUndefined<UpdatePetRequest>;
        const pet = await this.petService.updatePet(id, data);
        if (!pet) {
            throw new NotFoundError(`Pet with id ${id} not found`);
        }
        res.status(200).json({
            id: pet.id,
            nome: pet.nome,
            raca: pet.raca,
            id_dono: pet.id_dono,
        });
    }

    async delete(_req: Request, res: Response): Promise<void> {
        const { id } = res.locals.params as PetParams;
        const deleted = await this.petService.deletePet(id);
        if (!deleted) {
            throw new NotFoundError(`Pet with id ${id} not found`);
        }
        res.status(204).send();
    }
}
