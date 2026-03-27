import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EmptyStateComponent } from '../../../shared/ui/empty-state.component';

@Component({
  selector: 'app-home-page',
  imports: [EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section aria-labelledby="todos-title">
      <h2 id="todos-title">Tareas</h2>
      <app-empty-state message="El listado de tareas se implementa en la Fase 3." />
    </section>
  `,
})
export class HomePageComponent {}

