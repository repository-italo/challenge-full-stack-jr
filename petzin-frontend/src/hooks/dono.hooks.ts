import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { donoService } from '../services/dono.service';
import type { Dono } from '../types/dono';

export function useDono(id: number) {
    return useQuery({
        queryKey: ['dono', id],
        queryFn: () => donoService.getById(id),
    });
}

export function useDonos() {
    return useQuery({
        queryKey: ['donos'],
        queryFn: () => donoService.getAll(),
    });
}

export function useCreateDono() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Omit<Dono, 'id'>) => donoService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['donos'] });
        },
    });
}

export function useEditDono(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<Dono>) => donoService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dono', id] });
            queryClient.invalidateQueries({ queryKey: ['donos'] });
        },
    });
}

export function useDeleteDono() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => donoService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['donos'] });
        },
    });
}
