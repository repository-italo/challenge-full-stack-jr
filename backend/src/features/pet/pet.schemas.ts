import { z } from 'zod';

export const createPetSchema = z.object({
    nome: z.string().min(1, 'Nome é obrigatório').max(255),
    raca: z.string().min(1, 'Raça é obrigatória').max(255),
    id_dono: z.number().int().positive('ID do dono é obrigatório'),
});

export const updatePetSchema = z.object({
    nome: z.string().min(1).max(255).optional(),
    raca: z.string().min(1).max(255).optional(),
    id_dono: z.number().int().positive().optional(),
});

export const petParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export const getPetsQuerySchema = z.object({
    dono_id: z.coerce.number().int().positive().optional(),
});

export type CreatePetRequest = z.infer<typeof createPetSchema>;
export type UpdatePetRequest = z.infer<typeof updatePetSchema>;
export type PetParams = z.infer<typeof petParamsSchema>;
export type GetPetQuerySchema = z.infer<typeof getPetsQuerySchema>;
