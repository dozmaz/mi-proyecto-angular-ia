import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-indicator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="loading" role="status" aria-live="polite">{{ label() }}</p>
  `,
  styles: `
    .loading {
      margin: 0;
      color: #1d4ed8;
      font-weight: 600;
    }
  `,
})
export class LoadingIndicatorComponent {
  readonly label = input('Cargando...');
}

