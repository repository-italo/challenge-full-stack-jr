export type Reserva = {
    id: number;
    id_canil: number;
    id_pet: number;
    pet_nome?: string;
    dono_nome?: string;
    data_entrada: string;
    data_saida: string;
    valor_total_pago: number;
};
