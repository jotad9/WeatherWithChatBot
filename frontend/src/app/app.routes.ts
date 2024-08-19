import { Routes } from '@angular/router';
import { HistorialComponent } from './weather/components/historial/historial.component';
import { PerfilComponent } from './weather/components/perfil/perfil.component';
import { WeatherTableComponent } from './weather/components/weather-table/weather-table.component';
import { WeatherComponent } from './weather/weather.component';

export const routes: Routes = [
  {
    path: 'weather',
    component: WeatherComponent,
    children: [
      {
        path: 'city',
        component: WeatherTableComponent,
      },
      {
        path: 'perfil',
        component: PerfilComponent,
      },
      {
        path: 'historial',
        component: HistorialComponent,
      },{
        path: '**',
        redirectTo: 'city'
      }
    ],
  },
  {
    path: '**',
    redirectTo: 'weather',
  },
];
