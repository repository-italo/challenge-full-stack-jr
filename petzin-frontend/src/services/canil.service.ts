import { api } from '../api/api';
import type { Canil } from '../types/canil';

export const canilService = {
  getAll: async (): Promise<Canil[]> => {
    try {
      const { data } = await api.get<Canil[]>('/canils');
      return data;
    } catch (error) {
      console.error('GET /canils failed', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<Canil> => {
    try {
      const { data } = await api.get<Canil>(`/canils/${id}`);
      return data;
    } catch (error) {
      console.error(`GET /canils/${id} failed`, error);
      throw error;
    }
  },

  create: async (data: Omit<Canil, 'id'>): Promise<Canil> => {
    try {
      const { data: created } = await api.post<Canil>('/canils', data);
      return created;
    } catch (error) {
      console.error('POST /canils failed', error);
      throw error;
    }
  },

  update: async (id: number, data: Partial<Canil>): Promise<Canil> => {
    try {
      const { data: updated } = await api.put<Canil>(`/canils/${id}`, data);
      return updated;
    } catch (error) {
      console.error(`PUT /canils/${id} failed`, error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/canils/${id}`);
    } catch (error) {
      console.error(`DELETE /canils/${id} failed`, error);
      throw error;
    }
  },
};
