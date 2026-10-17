import { api } from '../api/api';
import type { Dono } from '../types/dono';
import type { Pet } from '../types/pet';

export const donoService = {
  getAll: async (): Promise<Dono[]> => {
    try {
      const { data } = await api.get<Dono[]>('/donos');
      return data;
    } catch (error) {
      console.error('GET /donos failed', error);
      throw error;
    }
  },

  getWithPets: async (): Promise<(Dono & { pets: Pet[] })[]> => {
    try {
      const { data } = await api.get<(Dono & { pets: Pet[] })[]>('/donos/with-pets');
      return data;
    } catch (error) {
      console.error('GET /donos/with-pets failed', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<Dono> => {
    try {
      const { data } = await api.get<Dono>(`/donos/${id}`);
      return data;
    } catch (error) {
      console.error(`GET /donos/${id} failed`, error);
      throw error;
    }
  },

  create: async (data: Omit<Dono, 'id'>): Promise<Dono> => {
    try {
      const { data: created } = await api.post<Dono>('/donos', data);
      return created;
    } catch (error) {
      console.error('POST /donos failed', error);
      throw error;
    }
  },

  update: async (id: number, data: Partial<Dono>): Promise<Dono> => {
    try {
      const { data: updated } = await api.put<Dono>(`/donos/${id}`, data);
      return updated;
    } catch (error) {
      console.error(`PUT /donos/${id} failed`, error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/donos/${id}`);
    } catch (error) {
      console.error(`DELETE /donos/${id} failed`, error);
      throw error;
    }
  },
};
