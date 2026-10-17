import { api } from '../api/api';
import type { Pet } from '../types/pet';

export const petService = {
  getAll: async (filters?: { dono_id?: number }): Promise<Pet[]> => {
    try {
      const { data } = await api.get<Pet[]>('/pets', { params: filters });
      return data;
    } catch (error) {
      console.error('GET /pets failed', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<Pet> => {
    try {
      const { data } = await api.get<Pet>(`/pets/${id}`);
      return data;
    } catch (error) {
      console.error(`GET /pets/${id} failed`, error);
      throw error;
    }
  },

  create: async (data: Omit<Pet, 'id'>): Promise<Pet> => {
    try {
      const { data: created } = await api.post<Pet>('/pets', data);
      return created;
    } catch (error) {
      console.error('POST /pets failed', error);
      throw error;
    }
  },

  update: async (id: number, data: Partial<Pet>): Promise<Pet> => {
    try {
      const { data: updated } = await api.put<Pet>(`/pets/${id}`, data);
      return updated;
    } catch (error) {
      console.error(`PUT /pets/${id} failed`, error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/pets/${id}`);
    } catch (error) {
      console.error(`DELETE /pets/${id} failed`, error);
      throw error;
    }
  },
};
