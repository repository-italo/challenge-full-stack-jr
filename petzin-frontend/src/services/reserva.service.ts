import { api } from '../api/api';
import type { Reserva } from '../types/reserva';

export const reservaService = {
  getAll: async (filters?: { id_canil?: number; data_entrada?: string; data_saida?: string }): Promise<Reserva[]> => {
    try {
      const { data } = await api.get<Reserva[]>('/reservas', { params: filters });
      return data;
    } catch (error) {
      console.error('GET /reservas failed', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<Reserva> => {
    try {
      const { data } = await api.get<Reserva>(`/reservas/${id}`);
      return data;
    } catch (error) {
      console.error(`GET /reservas/${id} failed`, error);
      throw error;
    }
  },

  create: async (data: Omit<Reserva, 'id'>): Promise<Reserva> => {
    try {
      const { data: created } = await api.post<Reserva>('/reservas', data);
      return created;
    } catch (error) {
      console.error('POST /reservas failed', error);
      throw error;
    }
  },

  update: async (id: number, data: Partial<Reserva>): Promise<Reserva> => {
    try {
      const { data: updated } = await api.put<Reserva>(`/reservas/${id}`, data);
      return updated;
    } catch (error) {
      console.error(`PUT /reservas/${id} failed`, error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/reservas/${id}`);
    } catch (error) {
      console.error(`DELETE /reservas/${id} failed`, error);
      throw error;
    }
  },
};
