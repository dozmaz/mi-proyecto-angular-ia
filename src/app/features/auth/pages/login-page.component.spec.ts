import { convertToParamMap, ActivatedRoute, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { REMEMBER_ME_STORAGE_KEY, AuthService } from '../../../core/auth/auth.service';
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
      rememberMe: false,
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

  describe('remember-me', () => {
    it('should render the remember-me checkbox in the template', () => {
      const { fixture } = createComponent();
      const checkbox = fixture.nativeElement.querySelector('#remember-me') as HTMLInputElement;

      expect(checkbox).not.toBeNull();
      expect(checkbox.type).toBe('checkbox');
      expect(fixture.nativeElement.querySelector('label[for="remember-me"]')?.textContent?.trim()).toBe('Recordar usuario');
    });

    it('should preload the username and mark the checkbox when a saved username exists', () => {
      localStorage.setItem(REMEMBER_ME_STORAGE_KEY, 'elena');

      const { component } = createComponent();

      expect(component.form.controls.username.value).toBe('elena');
      expect(component.form.controls.rememberMe.value).toBe(true);
    });

    it('should NOT preload the username when no saved username exists', () => {
      const { component } = createComponent();

      expect(component.form.controls.username.value).toBe('');
      expect(component.form.controls.rememberMe.value).toBe(false);
    });

    it('should persist the username in localStorage when rememberMe is checked on submit', () => {
      const { component, authService } = createComponent();

      component.form.setValue({ username: 'carlos', password: 'abcd', rememberMe: true });
      component.submit();

      expect(authService.savedUsername()).toBe('carlos');
      expect(localStorage.getItem(REMEMBER_ME_STORAGE_KEY)).toBe('carlos');
    });

    it('should clear the saved username when rememberMe is unchecked on submit', () => {
      localStorage.setItem(REMEMBER_ME_STORAGE_KEY, 'carlos');

      const { component, authService } = createComponent();

      component.form.setValue({ username: 'carlos', password: 'abcd', rememberMe: false });
      component.submit();

      expect(authService.savedUsername()).toBe('');
      expect(localStorage.getItem(REMEMBER_ME_STORAGE_KEY)).toBeNull();
    });
  });
});

