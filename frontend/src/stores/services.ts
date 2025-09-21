import { create } from 'zustand';

import { apiClient } from '../lib/api/client.js';

export interface ServiceItem {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateServiceInput {
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
}

export interface ServicesState {
  items: ServiceItem[];
  loading: boolean;
  error: string | null;
  fetchServices: () => Promise<void>;
  createService: (input: CreateServiceInput) => Promise<ServiceItem>;
  reset: () => void;
}

export const servicesStore = create<ServicesState>((set, get) => ({
  items: [],
  loading: false,
  error: null,
  async fetchServices() {
    set({ loading: true, error: null });
    try {
      const data = await apiClient.getServices();
      set({ items: data as ServiceItem[], loading: false, error: null });
    } catch (e) {
      const msg = (e as { message?: string }).message || 'Failed to load services';
      set({ loading: false, error: msg });
      throw e;
    }
  },
  async createService(input) {
    set({ loading: true, error: null });
    try {
      const created = (await apiClient.createService(
        input as unknown as Parameters<typeof apiClient.createService>[0]
      )) as ServiceItem;
      const items = get().items.concat(created);
      set({ items, loading: false, error: null });
      return created;
    } catch (e) {
      const status = (e as { response?: { status?: number } }).response?.status;
      const msg =
        status === 401
          ? 'Unauthorized'
          : status === 403
            ? 'Forbidden'
            : (e as { message?: string }).message || 'Failed to create service';
      set({ loading: false, error: msg });
      throw e;
    }
  },
  reset() {
    set({ items: [], loading: false, error: null });
  },
}));

export type ServicesStore = typeof servicesStore;
