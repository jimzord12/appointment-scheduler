import { beforeEach, describe, expect, it } from 'vitest';

import { servicesStore } from '../stores/services.js';

describe('Services Store (T039)', () => {
  beforeEach(() => {
    // Reset store and storage before each test
    localStorage.clear();
    try {
      servicesStore.getState().reset();
    } catch {
      // ignore if not implemented yet
    }
  });

  it('has sane defaults', () => {
    const s = servicesStore.getState();
    expect(s.items).toEqual([]);
    expect(s.loading).toBe(false);
    expect(s.error).toBeNull();
  });

  it('fetchServices loads services from API', async () => {
    const s = servicesStore.getState();
    const p = s.fetchServices();
    expect(servicesStore.getState().loading).toBe(true);
    await p;
    const after = servicesStore.getState();
    expect(after.loading).toBe(false);
    expect(after.error).toBeNull();
    expect(after.items.length).toBeGreaterThanOrEqual(3); // matches MSW mockServices
  });

  it('createService succeeds for manager token and appends item', async () => {
    // Arrange: manager token
    localStorage.setItem('token', 'mock-manager-jwt-token');

    // Preload existing services
    await servicesStore.getState().fetchServices();
    const beforeLen = servicesStore.getState().items.length;

    // Act
    const created = await servicesStore.getState().createService({
      name: 'New Service',
      description: 'Desc',
      durationMinutes: 45,
      price: 50,
    });

    // Assert
    const after = servicesStore.getState();
    expect(created).toBeDefined();
    expect(typeof created.id).toBe('string');
    expect(after.items.length).toBe(beforeLen + 1);
  });

  it('createService fails with 401 when token missing', async () => {
    // No token
    await servicesStore.getState().fetchServices();
    const beforeLen = servicesStore.getState().items.length;
    await expect(
      servicesStore.getState().createService({
        name: 'Unauthorized Service',
        description: 'x',
        durationMinutes: 30,
        price: 10,
      })
    ).rejects.toMatchObject({ response: { status: 401 } });
    expect(servicesStore.getState().items.length).toBe(beforeLen);
    expect(servicesStore.getState().error).toBeTruthy();
  });

  it('createService fails with 403 for non-manager token', async () => {
    localStorage.setItem('token', 'mock-jwt-token'); // customer token
    await servicesStore.getState().fetchServices();
    await expect(
      servicesStore.getState().createService({
        name: 'Forbidden Service',
        description: 'x',
        durationMinutes: 30,
        price: 10,
      })
    ).rejects.toMatchObject({ response: { status: 403 } });
  });
});
