import { create } from 'zustand';

import { apiClient } from '../lib/api/client.js';

export type AppointmentStatus = 'pending' | 'approved' | 'rejected';

export interface AppointmentItem {
  id: string;
  userId: string;
  serviceId: string;
  requestedDate: string; // YYYY-MM-DD
  requestedTime: string; // HH:mm
  status: AppointmentStatus;
  notes?: string;
  managerNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CreateAppointmentInput {
  serviceId: string;
  requestedDate: string;
  requestedTime: string;
  notes?: string;
}

interface UpdateAppointmentInput {
  status: Exclude<AppointmentStatus, 'pending'>; // approved | rejected
  managerNotes?: string;
}

export interface AppointmentsState {
  items: AppointmentItem[];
  loading: boolean;
  error: string | null;
  fetchRequests: () => Promise<void>;
  createRequest: (input: CreateAppointmentInput) => Promise<AppointmentItem>;
  updateRequest: (id: string, input: UpdateAppointmentInput) => Promise<AppointmentItem>;
  reset: () => void;
}

export const appointmentsStore = create<AppointmentsState>((set, get) => ({
  items: [],
  loading: false,
  error: null,
  async fetchRequests() {
    set({ loading: true, error: null });
    try {
      const data = (await apiClient.getAppointmentRequests()) as AppointmentItem[];
      set({ items: data, loading: false, error: null });
    } catch (e) {
      const status = (e as { response?: { status?: number } }).response?.status;
      const msg =
        status === 401
          ? 'Unauthorized'
          : (e as { message?: string }).message || 'Failed to load requests';
      set({ loading: false, error: msg });
      throw e;
    }
  },
  async createRequest(input) {
    set({ loading: true, error: null });
    try {
      const created = (await apiClient.createAppointmentRequest(
        input as unknown as Parameters<typeof apiClient.createAppointmentRequest>[0]
      )) as AppointmentItem;
      set({ items: get().items.concat(created), loading: false, error: null });
      return created;
    } catch (e) {
      const status = (e as { response?: { status?: number } }).response?.status;
      const msg =
        status === 401
          ? 'Unauthorized'
          : (e as { message?: string }).message || 'Failed to create request';
      set({ loading: false, error: msg });
      throw e;
    }
  },
  async updateRequest(id, input) {
    set({ loading: true, error: null });
    try {
      const updated = (await apiClient.updateAppointmentRequest(
        id,
        input as unknown as Parameters<typeof apiClient.updateAppointmentRequest>[1]
      )) as AppointmentItem;
      const items = get().items.map(i => (i.id === id ? updated : i));
      set({ items, loading: false, error: null });
      return updated;
    } catch (e) {
      const status = (e as { response?: { status?: number } }).response?.status;
      const msg =
        status === 401
          ? 'Unauthorized'
          : status === 403
            ? 'Forbidden'
            : (e as { message?: string }).message || 'Failed to update request';
      set({ loading: false, error: msg });
      throw e;
    }
  },
  reset() {
    set({ items: [], loading: false, error: null });
  },
}));

export type AppointmentsStore = typeof appointmentsStore;
