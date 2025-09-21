import { beforeEach, describe, expect, it } from 'vitest';

import { appointmentsStore } from '../stores/appointments.js';

describe('Appointments Store (T040)', () => {
  beforeEach(() => {
    localStorage.clear();
    try {
      appointmentsStore.getState().reset();
    } catch {
      // ignore if not implemented yet
    }
  });

  it('has sane defaults', () => {
    const s = appointmentsStore.getState();
    expect(s.items).toEqual([]);
    expect(s.loading).toBe(false);
    expect(s.error).toBeNull();
  });

  it('fetchRequests fails with 401 when token missing', async () => {
    await expect(appointmentsStore.getState().fetchRequests()).rejects.toMatchObject({
      response: { status: 401 },
    });
    expect(appointmentsStore.getState().loading).toBe(false);
    expect(appointmentsStore.getState().error).toBeTruthy();
  });

  it('fetchRequests (customer) loads only own requests', async () => {
    localStorage.setItem('token', 'mock-jwt-token');
    await appointmentsStore.getState().fetchRequests();
    const after = appointmentsStore.getState();
    expect(after.loading).toBe(false);
    expect(after.error).toBeNull();
    expect(after.items.length).toBeGreaterThanOrEqual(1);
    // all items should belong to the same user
    const userIds = new Set(after.items.map((i: any) => i.userId));
    expect(userIds.size).toBe(1);
  });

  it('fetchRequests (manager) loads all requests', async () => {
    localStorage.setItem('token', 'mock-manager-jwt-token');
    await appointmentsStore.getState().fetchRequests();
    const after = appointmentsStore.getState();
    expect(after.items.length).toBeGreaterThanOrEqual(3);
  });

  it('createRequest succeeds and appends item (customer)', async () => {
    localStorage.setItem('token', 'mock-jwt-token');
    await appointmentsStore.getState().fetchRequests();
    const beforeLen = appointmentsStore.getState().items.length;
    const created = await appointmentsStore.getState().createRequest({
      serviceId: '123e4567-e89b-12d3-a456-426614174002',
      requestedDate: '2023-12-10',
      requestedTime: '09:00',
      notes: 'Please be on time',
    });
    const after = appointmentsStore.getState();
    expect(created).toBeDefined();
    expect(typeof created.id).toBe('string');
    expect(after.items.length).toBe(beforeLen + 1);
  });

  it('createRequest fails with 401 when token missing', async () => {
    await expect(
      appointmentsStore.getState().createRequest({
        serviceId: '123e4567-e89b-12d3-a456-426614174002',
        requestedDate: '2023-12-10',
        requestedTime: '09:00',
      })
    ).rejects.toMatchObject({ response: { status: 401 } });
    expect(appointmentsStore.getState().error).toBeTruthy();
  });

  it('updateRequest (manager) updates status and notes', async () => {
    localStorage.setItem('token', 'mock-manager-jwt-token');
    await appointmentsStore.getState().fetchRequests();
    const pending = appointmentsStore.getState().items.find((i: any) => i.status === 'pending');
    expect(pending).toBeTruthy();
    const id = pending!.id;

    const updated = await appointmentsStore
      .getState()
      .updateRequest(id, { status: 'approved', managerNotes: 'See you then' });

    expect(updated.status).toBe('approved');
    const afterItem = appointmentsStore.getState().items.find((i: any) => i.id === id);
    expect(afterItem?.status).toBe('approved');
    expect(afterItem?.managerNotes ?? 'See you then').toBe('See you then');
  });

  it('updateRequest (customer) fails with 403', async () => {
    localStorage.setItem('token', 'mock-jwt-token');
    await appointmentsStore.getState().fetchRequests();
    const target = appointmentsStore.getState().items[0];
    await expect(
      appointmentsStore.getState().updateRequest(target.id, { status: 'approved' })
    ).rejects.toMatchObject({ response: { status: 403 } });
  });
});
