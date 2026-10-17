import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { canilService } from '../services/canil.service';
import type { Canil } from '../types/canil';

export function useCanil(id: number) {
    return useQuery({
        queryKey: ['canil', id],
        queryFn: () => canilService.getById(id),
    });
}

export function useCanils() {
    return useQuery({
        queryKey: ['canils'],
        queryFn: () => canilService.getAll(),
    });
}

export function useCreateCanil() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Omit<Canil, 'id'>) => canilService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['canils'] });
        },
    });
}

export function useEditCanil(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<Canil>) => canilService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['canil', id] });
            queryClient.invalidateQueries({ queryKey: ['canils'] });
        },
    });
}

export function useDeleteCanil() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => canilService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['canils'] });
        },
    });
}
