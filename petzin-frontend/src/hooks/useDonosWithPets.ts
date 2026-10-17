import { useQuery } from '@tanstack/react-query';
import { donoService } from '../services/dono.service';
import type { Dono } from '../types/dono';
import type { Pet } from '../types/pet';

export function useDonosWithPets() {
    return useQuery({
        queryKey: ['donos-with-pets'],
        queryFn: (): Promise<(Dono & { pets: Pet[] })[]> => donoService.getWithPets(),
    });
}
