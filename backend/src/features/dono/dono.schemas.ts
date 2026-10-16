import { z } from 'zod';

export const createDonoSchema = z.object({
    nome: z.string().min(1, 'Nome é obrigatório').max(255),
    telefone: z.string().min(1, 'Telefone é obrigatório').max(20),
});

export const updateDonoSchema = z.object({
    nome: z.string().min(1).max(255).optional(),
    telefone: z.string().min(1).max(20).optional(),
});

export const donoParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export type CreateDonoRequest = z.infer<typeof createDonoSchema>;
export type UpdateDonoRequest = z.infer<typeof updateDonoSchema>;
export type DonoParams = z.infer<typeof donoParamsSchema>;
