import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly isAuthenticatedState = signal(false);

  readonly isAuthenticated = computed(() => this.isAuthenticatedState());

  setAuthenticated(value: boolean): void {
    this.isAuthenticatedState.set(value);
  }
}

