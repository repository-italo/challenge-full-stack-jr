import type { PetEntity } from './pet.entity.js';
import type { PetRepository } from './pet.repository.js';
import type { GetPetQuerySchema } from './pet.schemas.js';

export class PetService {
    constructor(private readonly petRepository: PetRepository) {}

    async getAllPets(filters?: GetPetQuerySchema): Promise<PetEntity[]> {
        return this.petRepository.findAll(filters);
    }

    async getPetById(id: number): Promise<PetEntity | null> {
        return this.petRepository.findById(id);
    }

    async createPet(data: { nome: string; raca: string; id_dono: number }): Promise<PetEntity> {
        return this.petRepository.create(data);
    }

    async updatePet(id: number, data: { nome?: string; raca?: string; id_dono?: number }): Promise<PetEntity | null> {
        return this.petRepository.update(id, data);
    }

    async deletePet(id: number): Promise<boolean> {
        return this.petRepository.delete(id);
    }
}
