import { CanilRepository } from './canil.repository.js';
import { CanilEntity } from './canil.entity.js';

export class CanilService {
    constructor(private readonly canilRepository: CanilRepository) {}

    async getAllCanis(): Promise<CanilEntity[]> {
        return this.canilRepository.findAll();
    }

    async getCanilById(id: number): Promise<CanilEntity | null> {
        return this.canilRepository.findById(id);
    }

    async createCanil(data: { numero: number; valor_diario: number }): Promise<CanilEntity> {
        return this.canilRepository.create(data);
    }

    async updateCanil(id: number, data: { numero?: number; valor_diario?: number }): Promise<CanilEntity | null> {
        return this.canilRepository.update(id, data);
    }

    async deleteCanil(id: number): Promise<boolean> {
        return this.canilRepository.delete(id);
    }
}
