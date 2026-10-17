import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservaService } from '../services/reserva.service';
import type { Reserva } from '../types/reserva';

export interface ReservaFilters {
    id_canil?: number;
    data_entrada?: string;
    data_saida?: string;
}

export function useReserva(id: number) {
    return useQuery({
        queryKey: ['reserva', id],
        queryFn: () => reservaService.getById(id),
    });
}

export function useReservas(filters?: ReservaFilters) {
    return useQuery({
        queryKey: ['reservas', filters],
        queryFn: () => reservaService.getAll(filters),
    });
}

export function useCreateReserva() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Omit<Reserva, 'id'>) => reservaService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reservas'] });
        },
    });
}

export function useEditReserva(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<Reserva>) => reservaService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reserva', id] });
            queryClient.invalidateQueries({ queryKey: ['reservas'] });
        },
    });
}

export function useDeleteReserva() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => reservaService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reservas'] });
        },
    });
}
