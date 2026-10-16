import { z } from 'zod';

export const createReservaSchema = z.object({
    id_canil: z.number().int().positive('ID do canil é obrigatório'),
    id_pet: z.number().int().positive('ID do pet é obrigatório'),
    data_entrada: z.coerce.date(),
    data_saida: z.coerce.date(),
    valor_total_pago: z.number().positive('Valor total pago é obrigatório'),
});

export const updateReservaSchema = z.object({
    id_canil: z.number().int().positive().optional(),
    id_pet: z.number().int().positive().optional(),
    data_entrada: z.coerce.date().optional(),
    data_saida: z.coerce.date().optional(),
    valor_total_pago: z.number().positive().optional(),
});

export const reservaParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export type CreateReservaRequest = z.infer<typeof createReservaSchema>;
export type UpdateReservaRequest = z.infer<typeof updateReservaSchema>;
export type ReservaParams = z.infer<typeof reservaParamsSchema>;
