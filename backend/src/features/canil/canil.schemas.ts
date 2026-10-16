import { z } from 'zod';

export const createCanilSchema = z.object({
    numero: z.number().int().positive('Número do canil é obrigatório'),
    valor_diario: z.number().positive('Valor diário é obrigatório'),
});

export const updateCanilSchema = z.object({
    numero: z.number().int().positive().optional(),
    valor_diario: z.number().positive().optional(),
});

export const canilParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export type CreateCanilRequest = z.infer<typeof createCanilSchema>;
export type UpdateCanilRequest = z.infer<typeof updateCanilSchema>;
export type CanilParams = z.infer<typeof canilParamsSchema>;
