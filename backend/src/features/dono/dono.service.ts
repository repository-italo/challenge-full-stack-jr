import type { DonoEntity } from './dono.entity.js';
import type { DonoRepository } from './dono.repository.js';

export class DonoService {
    constructor(private readonly donoRepository: DonoRepository) {}

    async getAllDonos(): Promise<DonoEntity[]> {
        return this.donoRepository.findAll();
    }

    async getAllDonosWithPets() {
        return this.donoRepository.findAllWithPets();
    }

    async getDonoById(id: number): Promise<DonoEntity | null> {
        return this.donoRepository.findById(id);
    }

    async createDono(data: { nome: string; telefone: string }): Promise<DonoEntity> {
        return this.donoRepository.create(data);
    }

    async updateDono(id: number, data: { nome?: string; telefone?: string }): Promise<DonoEntity | null> {
        return this.donoRepository.update(id, data);
    }

    async deleteDono(id: number): Promise<boolean> {
        return this.donoRepository.delete(id);
    }
}
