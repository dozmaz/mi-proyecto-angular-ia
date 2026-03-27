import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';

export interface AuthSession {
  username: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export const AUTH_STORAGE_KEY = 'mi-proyecto-angular.auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storage = isPlatformBrowser(this.platformId) ? globalThis.localStorage : null;
  private readonly sessionState = signal<AuthSession | null>(this.readStoredSession());

  readonly session = computed(() => this.sessionState());
  readonly isAuthenticated = computed(() => this.sessionState() !== null);
  readonly username = computed(() => this.sessionState()?.username ?? '');

  login(credentials: LoginCredentials): boolean {
    const username = credentials.username.trim();
    const password = credentials.password.trim();

    if (!username || !password) {
      return false;
    }

    const session: AuthSession = { username };
    this.sessionState.set(session);
    this.storage?.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));

    return true;
  }

  logout(): void {
    this.sessionState.set(null);
    this.storage?.removeItem(AUTH_STORAGE_KEY);
  }

  private readStoredSession(): AuthSession | null {
    const storedValue = this.storage?.getItem(AUTH_STORAGE_KEY);

    if (!storedValue) {
      return null;
    }

    try {
      const parsedValue = JSON.parse(storedValue) as Partial<AuthSession>;

      if (typeof parsedValue.username !== 'string' || parsedValue.username.trim() === '') {
        this.storage?.removeItem(AUTH_STORAGE_KEY);
        return null;
      }

      return { username: parsedValue.username.trim() };
    } catch {
      this.storage?.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  }
}

