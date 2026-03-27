import { TestBed } from '@angular/core/testing';

import { AUTH_STORAGE_KEY, AuthService } from './auth.service';

describe('AuthService', () => {
  const createService = (): AuthService => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    return TestBed.inject(AuthService);
  };

  afterEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  it('should start unauthenticated when there is no persisted session', () => {
    const service = createService();

    expect(service.isAuthenticated()).toBe(false);
    expect(service.session()).toBeNull();
    expect(service.username()).toBe('');
  });

  it('should persist the session when login succeeds', () => {
    const service = createService();

    const didLogin = service.login({ username: '  ana  ', password: '1234' });

    expect(didLogin).toBe(true);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.username()).toBe('ana');
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBe(JSON.stringify({ username: 'ana' }));
  });

  it('should restore the session from localStorage in a new injector', () => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ username: 'carla' }));

    const service = createService();

    expect(service.isAuthenticated()).toBe(true);
    expect(service.session()).toEqual({ username: 'carla' });
  });

  it('should clear session state and storage on logout', () => {
    const service = createService();
    service.login({ username: 'mario', password: 'abcd' });

    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(service.session()).toBeNull();
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
  });
});

