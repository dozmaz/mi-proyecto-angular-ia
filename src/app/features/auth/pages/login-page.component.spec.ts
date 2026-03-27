import { convertToParamMap, ActivatedRoute, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { AuthService } from '../../../core/auth/auth.service';
import { LoginPageComponent } from './login-page.component';

describe('LoginPageComponent', () => {
  const createComponent = (returnUrl?: string) => {
    const navigateByUrl = vi.fn().mockResolvedValue(true);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap(returnUrl ? { returnUrl } : {}),
            },
          },
        },
        {
          provide: Router,
          useValue: {
            navigateByUrl,
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(LoginPageComponent);
    const component = fixture.componentInstance;
    const authService = TestBed.inject(AuthService);

    fixture.detectChanges();

    return {
      fixture,
      component,
      authService,
      navigateByUrl,
    };
  };

  afterEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  it('should expose accessible validation errors when the form is submitted empty', () => {
    const { fixture, navigateByUrl } = createComponent();
    const element = fixture.nativeElement as HTMLElement;
    const form = element.querySelector('form');

    form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    const usernameInput = element.querySelector('#username');
    const passwordInput = element.querySelector('#password');

    expect(usernameInput?.getAttribute('aria-invalid')).toBe('true');
    expect(passwordInput?.getAttribute('aria-invalid')).toBe('true');
    expect(element.querySelector('#username-error')?.textContent).toContain('El usuario es obligatorio.');
    expect(element.querySelector('#password-error')?.textContent).toContain('La contrasena es obligatoria.');
    expect(navigateByUrl).not.toHaveBeenCalled();
  });

  it('should authenticate and redirect to the requested private route', () => {
    const { component, authService, navigateByUrl } = createComponent('/todos');

    component.form.setValue({
      username: 'laura',
      password: '1234',
    });

    component.submit();

    expect(authService.isAuthenticated()).toBe(true);
    expect(authService.username()).toBe('laura');
    expect(navigateByUrl).toHaveBeenCalledWith('/todos', { replaceUrl: true });
  });

  it('should redirect authenticated users away from login on init', () => {
    const { authService, navigateByUrl } = createComponent('/todos');

    authService.login({ username: 'maria', password: '1234' });

    const fixture = TestBed.createComponent(LoginPageComponent);
    fixture.detectChanges();

    expect(navigateByUrl).toHaveBeenCalledWith('/todos', { replaceUrl: true });
  });
});

