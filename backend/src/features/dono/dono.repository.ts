import { getCachedModels } from '@/integrations/database/index.js';
import type { Dono } from '@/integrations/database/models/dono.js';
import { type DonoData, DonoEntity } from './dono.entity.js';

export class DonoRepository {
    private Dono: typeof Dono;

    constructor() {
        ({ Dono: this.Dono } = getCachedModels());
    }

    async findAll(): Promise<DonoEntity[]> {
        const donos = await this.Dono.findAll();
        return donos.map((dono) => DonoEntity.restore(dono.toJSON() as DonoData));
    }

    async findAllWithPets() {
        const { Pet } = getCachedModels();
        const donos = await this.Dono.findAll({
            include: [{ model: Pet, as: 'pet' }],
        });

        return donos.map((dono) => ({
            id: dono.id,
            nome: dono.nome,
            telefone: dono.telefone,
            pets: (dono.get('pet') as any[]).map((pet) => ({
                id: pet.id,
                nome: pet.nome,
                raca: pet.raca,
                id_dono: pet.id_dono,
            })),
        }));
    }

    async findById(id: number): Promise<DonoEntity | null> {
        const dono = await this.Dono.findByPk(id);
        if (!dono) return null;
        return DonoEntity.restore(dono.toJSON() as DonoData);
    }

    async create(data: { nome: string; telefone: string }): Promise<DonoEntity> {
        const dono = await this.Dono.create(data);
        return DonoEntity.restore(dono.toJSON() as DonoData);
    }

    async update(id: number, data: { nome?: string; telefone?: string }): Promise<DonoEntity | null> {
        const dono = await this.Dono.findByPk(id);
        if (!dono) return null;
        await dono.update(data);
        return DonoEntity.restore(dono.toJSON() as DonoData);
    }

    async delete(id: number): Promise<boolean> {
        const dono = await this.Dono.findByPk(id);
        if (!dono) return false;
        await dono.destroy();
        return true;
    }
}
