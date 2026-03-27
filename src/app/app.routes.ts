import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { ShellComponent } from './core/layout/shell.component';

export const routes: Routes = [
  {
	path: '',
	component: ShellComponent,
	children: [
	  {
		path: '',
		pathMatch: 'full',
		redirectTo: 'todos',
	  },
	  {
		path: 'login',
		loadChildren: () =>
		  import('./features/auth/auth.routes').then((m) => m.authRoutes),
	  },
	  {
		path: 'todos',
		canActivate: [authGuard],
		loadChildren: () =>
		  import('./features/todos/todos.routes').then((m) => m.todosRoutes),
	  },
	],
  },
  {
	path: '**',
	redirectTo: 'todos',
  },
];
