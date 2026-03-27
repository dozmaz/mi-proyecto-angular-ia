import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="empty-state" role="status" aria-live="polite">{{ message() }}</p>
  `,
  styles: `
    .empty-state {
      margin: 0;
      color: #4b5563;
    }
  `,
})
export class EmptyStateComponent {
  readonly message = input('No hay elementos para mostrar.');
}

