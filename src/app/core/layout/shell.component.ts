import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="shell-header">
      <h1 class="shell-title">Mi Proyecto Angular</h1>
      <nav aria-label="Navegacion principal" class="shell-nav">
        <a routerLink="/todos" routerLinkActive="is-active">Tareas</a>
        <a routerLink="/login" routerLinkActive="is-active">Login</a>
      </nav>
    </header>

    <main class="shell-content">
      <router-outlet />
    </main>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100dvh;
      background: #f9fafb;
      color: #1f2937;
    }

    .shell-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
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
    }

    .shell-nav a {
      color: inherit;
      text-decoration: none;
      border-bottom: 2px solid transparent;
    }

    .shell-nav a.is-active {
      border-bottom-color: #fbbf24;
    }

    .shell-content {
      padding: 1.25rem;
    }
  `,
})
export class ShellComponent {}

