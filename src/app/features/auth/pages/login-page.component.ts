import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section aria-labelledby="login-title" class="login-page">
      <div class="login-card">
        <h2 id="login-title">Iniciar sesion</h2>
        <p class="login-copy">
          Introduce tus credenciales para acceder a la gestion de tareas.
        </p>

        <form [formGroup]="form" class="login-form" novalidate (ngSubmit)="submit()">
          <div class="field-group">
            <label for="username">Usuario</label>
            <input
              id="username"
              type="text"
              formControlName="username"
              autocomplete="username"
              [attr.aria-invalid]="usernameInvalid"
              [attr.aria-describedby]="usernameInvalid ? 'username-error' : null"
            />

            @if (usernameInvalid) {
              <p id="username-error" aria-live="polite" class="field-error">
                El usuario es obligatorio.
              </p>
            }
          </div>

          <div class="field-group">
            <label for="password">Contrasena</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              autocomplete="current-password"
              [attr.aria-invalid]="passwordInvalid"
              [attr.aria-describedby]="passwordInvalid ? 'password-error' : null"
            />

            @if (passwordInvalid) {
              <p id="password-error" aria-live="polite" class="field-error">
                @if (form.controls.password.hasError('required')) {
                  La contrasena es obligatoria.
                } @else if (form.controls.password.hasError('minlength')) {
                  La contrasena debe tener al menos 4 caracteres.
                }
              </p>
            }
          </div>

          <div class="field-group field-group--checkbox">
            <input
              id="remember-me"
              type="checkbox"
              formControlName="rememberMe"
            />
            <label for="remember-me">Recordar usuario</label>
          </div>

          @if (authError()) {
            <p aria-live="assertive" class="auth-error">{{ authError() }}</p>
          }

          <button class="submit-button" type="submit">Entrar</button>
        </form>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .login-page {
      display: grid;
      place-items: center;
      min-height: calc(100dvh - 6rem);
    }

    .login-card {
      width: min(100%, 28rem);
      padding: 1.5rem;
      border-radius: 1rem;
      background: #ffffff;
      border: 1px solid #d1d5db;
      box-shadow: 0 10px 25px rgb(15 23 42 / 0.08);
    }

    h2 {
      margin: 0 0 0.5rem;
      color: #111827;
    }

    .login-copy {
      margin: 0 0 1rem;
      color: #374151;
    }

    .login-form {
      display: grid;
      gap: 1rem;
    }

    .field-group {
      display: grid;
      gap: 0.375rem;
    }

    label {
      font-weight: 600;
      color: #111827;
    }

    input {
      border: 1px solid #6b7280;
      border-radius: 0.5rem;
      padding: 0.75rem;
      font: inherit;
      color: #111827;
      background: #ffffff;
    }

    input:focus-visible,
    .submit-button:focus-visible {
      outline: 3px solid #2563eb;
      outline-offset: 2px;
    }

    .field-error,
    .auth-error {
      margin: 0;
      color: #b91c1c;
    }

    .submit-button {
      justify-self: start;
      border: 0;
      border-radius: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: #1d4ed8;
      color: #ffffff;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }

    .submit-button:hover {
      background: #1e40af;
    }

    .field-group--checkbox {
      grid-template-columns: auto 1fr;
      align-items: center;
      gap: 0.5rem;
    }

    #remember-me {
      width: 1.25rem;
      height: 1.25rem;
      cursor: pointer;
    }

    #remember-me + label {
      cursor: pointer;
    }
  `,
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly submitAttempted = signal(false);
  readonly authError = signal<string | null>(null);
  readonly form = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    rememberMe: [false],
  });

  get usernameInvalid(): boolean {
    return this.isControlInvalid('username');
  }

  get passwordInvalid(): boolean {
    return this.isControlInvalid('password');
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      void this.router.navigateByUrl(this.getRedirectUrl(), { replaceUrl: true });
      return;
    }

    const savedUsername = this.authService.savedUsername();
    if (savedUsername) {
      this.form.patchValue({ username: savedUsername, rememberMe: true });
    }
  }

  submit(): void {
    this.submitAttempted.set(true);
    this.authError.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { rememberMe, username, password } = this.form.getRawValue();
    const didLogin = this.authService.login({ username, password });

    if (!didLogin) {
      this.authError.set('No fue posible iniciar sesion. Intentalo de nuevo.');
      return;
    }

    if (rememberMe) {
      this.authService.rememberUsername(username);
    } else {
      this.authService.forgetUsername();
    }

    void this.router.navigateByUrl(this.getRedirectUrl(), { replaceUrl: true });
  }

  private getRedirectUrl(): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    return returnUrl?.startsWith('/') ? returnUrl : '/todos';
  }

  private isControlInvalid(controlName: 'username' | 'password'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || this.submitAttempted());
  }
}

