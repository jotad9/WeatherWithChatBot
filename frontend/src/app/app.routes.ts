import { Routes } from '@angular/router';
import { WeatherComponent } from './weather/weather.component';
import { WeatherTableComponent } from './weather/components/weather-table/weather-table.component';

export const routes: Routes = [
  {
    path: 'weather',
    component: WeatherComponent,
    children: [
      {
        path: 'city',
        component: WeatherTableComponent, // Carga inmediata
      },
      {
        path: 'perfil',
        loadComponent: () => import('./weather/components/perfil/perfil.component').then(m => m.PerfilComponent),
      },
      {
        path: 'historial',
        loadComponent: () => import('./weather/components/historial/historial.component').then(m => m.HistorialComponent),
      },
      {
        path: '',
        redirectTo: 'city',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: 'city'
      }
    ],
  },
  {
    path: '',
    redirectTo: 'weather',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'weather',
  },
];
