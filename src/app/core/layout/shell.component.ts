import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip-link" href="#main-content">Saltar al contenido principal</a>

    <header class="shell-header">
      <h1 class="shell-title">Mi Proyecto Angular</h1>

      <nav aria-label="Navegacion principal" class="shell-nav">
        @if (isAuthenticated()) {
          <a
            ariaCurrentWhenActive="page"
            routerLink="/todos"
            routerLinkActive="is-active"
          >
            Tareas
          </a>
          <span class="shell-user">Hola, {{ username() }}</span>
          <button class="logout-button" type="button" (click)="logout()">
            Cerrar sesion
          </button>
        } @else {
          <a
            ariaCurrentWhenActive="page"
            routerLink="/login"
            routerLinkActive="is-active"
          >
            Login
          </a>
        }
      </nav>
    </header>

    <main id="main-content" class="shell-content" tabindex="-1">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100dvh;
      background: #f9fafb;
      color: #1f2937;
    }

    .skip-link {
      position: absolute;
      left: 1rem;
      top: 1rem;
      transform: translateY(-200%);
      padding: 0.75rem 1rem;
      background: #ffffff;
      color: #111827;
      border: 2px solid #2563eb;
      border-radius: 0.5rem;
      text-decoration: none;
      z-index: 10;
    }

    .skip-link:focus-visible {
      transform: translateY(0);
    }

    .shell-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
      padding: 1rem 1.25rem;
      background: #111827;
      color: #f9fafb;
    }

    .shell-title {
      margin: 0;
      font-size: 1.125rem;
    }

    .shell-nav {
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .shell-nav a,
    .logout-button {
      color: inherit;
      font: inherit;
      text-decoration: none;
      border-bottom: 2px solid transparent;
      background: transparent;
      border-top: 0;
      border-left: 0;
      border-right: 0;
      cursor: pointer;
      padding: 0;
    }

    .shell-nav a.is-active {
      border-bottom-color: #fbbf24;
    }

    .shell-user {
      color: #d1d5db;
    }

    .shell-nav a:focus-visible,
    .logout-button:focus-visible {
      outline: 3px solid #93c5fd;
      outline-offset: 3px;
      border-radius: 0.25rem;
    }

    .shell-content {
      padding: 1.25rem;
    }
  `,
})
export class ShellComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly username = this.authService.username;

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}

