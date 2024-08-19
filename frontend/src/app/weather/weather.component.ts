import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { HistorialComponent } from './components/historial/historial.component';
import { ModalComponent } from './components/modal/modal.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { WeatherTableComponent } from './components/weather-table/weather-table.component';

@Component({
  selector: 'weather',
  standalone: true,
  imports: [
    CommonModule,FormsModule,SearchBoxComponent,ModalComponent,RouterOutlet,HttpClientModule,PerfilComponent,ModalComponent,HistorialComponent,WeatherTableComponent
  ],
  templateUrl: './weather.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherComponent {

}
