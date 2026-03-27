import { provideRouter, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { AuthService } from '../auth/auth.service';
import { ShellComponent } from './shell.component';

describe('ShellComponent', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ShellComponent],
      providers: [provideRouter([])],
    });
  });

  afterEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  it('should show the login link when there is no authenticated session', () => {
    const fixture = TestBed.createComponent(ShellComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Login');
    expect(element.textContent).not.toContain('Cerrar sesion');
  });

  it('should allow logout from the shell when the session is active', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const authService = TestBed.inject(AuthService);
    authService.login({ username: 'andres', password: '1234' });

    const fixture = TestBed.createComponent(ShellComponent);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();

    expect(authService.isAuthenticated()).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith('/login', { replaceUrl: true });
  });
});

