import { getCachedModels } from '@/integrations/database/index.js';
import type { Canil } from '@/integrations/database/models/canil.js';
import { type CanilData, CanilEntity } from './canil.entity.js';

export class CanilRepository {
    private Canil: typeof Canil;

    constructor() {
        ({ Canil: this.Canil } = getCachedModels());
    }

    async findAll(): Promise<CanilEntity[]> {
        const canils = await this.Canil.findAll();
        return canils.map((canil) => CanilEntity.restore(canil.toJSON() as CanilData));
    }

    async findById(id: number): Promise<CanilEntity | null> {
        const canil = await this.Canil.findByPk(id);
        if (!canil) return null;
        return CanilEntity.restore(canil.toJSON() as CanilData);
    }

    async create(data: { numero: number; valor_diario: number }): Promise<CanilEntity> {
        const canil = await this.Canil.create(data);
        return CanilEntity.restore(canil.toJSON() as CanilData);
    }

    async update(id: number, data: { numero?: number; valor_diario?: number }): Promise<CanilEntity | null> {
        const canil = await this.Canil.findByPk(id);
        if (!canil) return null;
        await canil.update(data);
        return CanilEntity.restore(canil.toJSON() as CanilData);
    }

    async delete(id: number): Promise<boolean> {
        const canil = await this.Canil.findByPk(id);
        if (!canil) return false;
        await canil.destroy();
        return true;
    }
}
