import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-login-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section aria-labelledby="login-title">
      <h2 id="login-title">Login</h2>
      <p>La pantalla de autenticacion se implementa en la Fase 2.</p>
    </section>
  `,
})
export class LoginPageComponent {}

