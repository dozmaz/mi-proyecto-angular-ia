import { Routes } from '@angular/router';

import { HomePageComponent } from './pages/home-page.component';

export const todosRoutes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    title: 'Home',
  },
];

