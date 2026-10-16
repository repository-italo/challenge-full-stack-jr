import type { Request, Response } from 'express';
import type { RemoveUndefined } from '@/shared/types/index.js';
import type { CreatePetRequest, PetParams, UpdatePetRequest } from './pet.schemas.js';
import type { PetService } from './pet.service.js';

export class PetController {
    constructor(private readonly petService: PetService) {}

    async getAll(_req: Request, res: Response): Promise<void> {
        try {
            const pets = await this.petService.getAllPets();
            res.status(200).json(pets);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getById(_req: Request, res: Response): Promise<void> {
        try {
            const { id } = res.locals.params as PetParams;
            const pet = await this.petService.getPetById(id);
            if (!pet) {
                res.status(404).json({ error: 'Pet not found' });
                return;
            }
            res.status(200).json(pet);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async create(_req: Request, res: Response): Promise<void> {
        try {
            const data = res.locals.body as CreatePetRequest;
            const pet = await this.petService.createPet(data);
            res.status(201).json(pet);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async update(_req: Request, res: Response): Promise<void> {
        try {
            const { id } = res.locals.params as PetParams;
            const data = res.locals.body as RemoveUndefined<UpdatePetRequest>;
            const pet = await this.petService.updatePet(id, data);
            if (!pet) {
                res.status(404).json({ error: 'Pet not found' });
                return;
            }
            res.status(200).json(pet);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async delete(_req: Request, res: Response): Promise<void> {
        try {
            const { id } = res.locals.params as PetParams;
            const deleted = await this.petService.deletePet(id);
            if (!deleted) {
                res.status(404).json({ error: 'Pet not found' });
                return;
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
