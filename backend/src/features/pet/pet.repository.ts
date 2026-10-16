import { getCachedModels } from '@/integrations/database/index.js';
import type { Pet } from '@/integrations/database/models/pet.js';
import { type PetData, PetEntity } from './pet.entity.js';

export class PetRepository {
    private Pet: typeof Pet;

    constructor() {
        ({ Pet: this.Pet } = getCachedModels());
    }

    async findAll(): Promise<PetEntity[]> {
        const pets = await this.Pet.findAll();
        return pets.map((pet) => PetEntity.restore(pet.toJSON() as PetData));
    }

    async findById(id: number): Promise<PetEntity | null> {
        const pet = await this.Pet.findByPk(id);
        if (!pet) return null;
        return PetEntity.restore(pet.toJSON() as PetData);
    }

    async create(data: { nome: string; raca: string; id_dono: number }): Promise<PetEntity> {
        const pet = await this.Pet.create(data);
        return PetEntity.restore(pet.toJSON() as PetData);
    }

    async update(id: number, data: { nome?: string; raca?: string; id_dono?: number }): Promise<PetEntity | null> {
        const pet = await this.Pet.findByPk(id);
        if (!pet) return null;
        await pet.update(data);
        return PetEntity.restore(pet.toJSON() as PetData);
    }

    async delete(id: number): Promise<boolean> {
        const pet = await this.Pet.findByPk(id);
        if (!pet) return false;
        await pet.destroy();
        return true;
    }
}
