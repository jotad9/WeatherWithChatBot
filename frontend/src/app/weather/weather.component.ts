import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'weather',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterOutlet,
  ],
  templateUrl: './weather.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherComponent {

}
