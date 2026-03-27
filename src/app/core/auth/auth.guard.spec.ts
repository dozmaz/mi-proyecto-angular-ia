import { provideRouter, Router, UrlTree } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
  });

  afterEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  it('should allow access when the user is authenticated', () => {
    const authService = TestBed.inject(AuthService);
    authService.login({ username: 'ana', password: '1234' });

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as never, { url: '/todos' } as never),
    );

    expect(result).toBe(true);
  });

  it('should redirect to login preserving the requested URL when the user is not authenticated', () => {
    const router = TestBed.inject(Router);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as never, { url: '/todos' } as never),
    );

    expect(result instanceof UrlTree).toBe(true);
    expect(router.serializeUrl(result as UrlTree)).toBe('/login?returnUrl=%2Ftodos');
  });
});

