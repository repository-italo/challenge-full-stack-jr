import { z } from 'zod';

export const createReservaSchema = z.object({
    id_canil: z.number().int().positive('ID do canil é obrigatório'),
    id_pet: z.number().int().positive('ID do pet é obrigatório'),
    data_entrada: z.coerce.date(),
    data_saida: z.coerce.date(),
    valor_total_pago: z.number().positive('Valor total pago é obrigatório'),
}).refine(
    (data) => data.data_saida >= data.data_entrada,
    {
        message: 'Data de saída deve ser igual ou posterior à data de entrada',
        path: ['data_saida'],
    }
);

export const updateReservaSchema = z.object({
    id_canil: z.number().int().positive().optional(),
    id_pet: z.number().int().positive().optional(),
    data_entrada: z.coerce.date().optional(),
    data_saida: z.coerce.date().optional(),
    valor_total_pago: z.number().positive().optional(),
}).refine(
    (data) => {
        if (data.data_entrada && data.data_saida) {
            return data.data_saida >= data.data_entrada;
        }
        return true;
    },
    {
        message: 'Data de saída deve ser igual ou posterior à data de entrada',
        path: ['data_saida'],
    }
);

export const reservaParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export const getReservasQuerySchema = z.object({
    id_canil: z.coerce.number().int().positive().optional(),
    data_entrada: z.coerce.date().optional(),
    data_saida: z.coerce.date().optional(),
});

export type CreateReservaRequest = z.infer<typeof createReservaSchema>;
export type UpdateReservaRequest = z.infer<typeof updateReservaSchema>;
export type ReservaParams = z.infer<typeof reservaParamsSchema>;
export type GetReservasQuerySchema = z.infer<typeof getReservasQuerySchema>;
