import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { petService } from '../services/pet.service';
import type { Pet } from '../types/pet';

export function usePet(id: number) {
    return useQuery({
        queryKey: ['pet', id],
        queryFn: () => petService.getById(id),
    });
}

export function usePets(filters?: { dono_id?: number }) {
    return useQuery({
        queryKey: ['pets', filters?.dono_id],
        queryFn: () => petService.getAll(filters),
        enabled: filters?.dono_id !== undefined || !filters,
    });
}

export function useCreatePet() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Omit<Pet, 'id'>) => petService.create(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['donos-with-pets'] });
        },
    });
}

export function useEditPet(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<Pet>) => petService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pet', id] });
            queryClient.invalidateQueries({ queryKey: ['pets'] });
        },
    });
}

export function useDeletePet() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => petService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pets'] });
        },
    });
}
