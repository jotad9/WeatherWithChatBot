import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import axios from 'axios';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/operators';
import { Usuario } from '../../../interfaces/Usuario';
import { ChatbotComponent } from '../chatbot/chatbot.component';
import { ModalComponent } from '../modal/modal.component';
import { SearchBoxComponent } from '../search-box/search-box.component';
@Component({
  selector: 'weather-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SearchBoxComponent,
    ModalComponent,
    HttpClientModule,
    ChatbotComponent
  ],
  templateUrl: './weather-table.component.html',
})
export class WeatherTableComponent implements OnInit {
  isLoggin = false; // Asume que el usuario no está logueado al principio
  private apiKey: string = 'cabdbda40038ba7d1165b953b1c7bd6c';
  private apiUrl: string = 'https://api.openweathermap.org/data/2.5/weather';
  city: string = '';
  @Output() citySearched = new EventEmitter<boolean>();
  @Output() lastSearchedCity = new EventEmitter<string>();
  user!: Usuario;

  constructor(private http: HttpClient) {
    this.displayForecast = this.displayForecast.bind(this);
  }

  handleUserLoggedIn() {
    this.isLoggin = true;
    this.loadCity();
  }

  loadCity() {
    this.isLoggin = localStorage.getItem('isLoggin') === 'true';
    // Intenta obtener la última ciudad buscada del localStorage
    let lastSearchedCity = localStorage.getItem('lastSearchedCity');
    if (lastSearchedCity) {
      this.search(lastSearchedCity);
    } else if (!this.isLoggin) {
      this.search('Madrid');
    } else {
      // Comprueba si ya se ha buscado la ciudad
      let citySearched = localStorage.getItem('citySearched') === 'true';
      if (!citySearched) {
        // Intenta obtener el perfil del usuario del localStorage
        let user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user && Object.keys(user).length > 0) {
          this.user = user;
          this.search(this.user.city);
          localStorage.setItem('citySearched', 'true');
        }
      }
    }
  }

  ngOnInit() {
    this.handleUserLoggedIn();
  }

  async search(city: string) {
    // Intenta obtener los datos del clima de todas las ciudades del localStorage
    const lastSearchedCity = localStorage.getItem('lastSearchedCity');
    let allWeatherData = JSON.parse(
      localStorage.getItem('allWeatherData') || '{}'
    );
    if (Object.keys(allWeatherData).length > 10) {
      localStorage.removeItem('allWeatherData');
      allWeatherData = {};
    }
    if (allWeatherData[city]) {
      // Si los datos del clima para la ciudad están en el localStorage, úsalos
      this.displayTemperature({ data: allWeatherData[city] });
      if (lastSearchedCity !== city) {
        localStorage.setItem('lastSearchedCity', city);
        this.lastSearchedCity.emit(city);
        this.onHistorial();
      }
    } else {
      const params = {
        q: city,
        appid: this.apiKey,
        units: 'metric',
      };

      axios
        .get(this.apiUrl, { params })
        .then((response) => {
          this.displayTemperature(response);

          // Guarda los datos del clima en el objeto allWeatherData
          allWeatherData[city] = response.data;

          // Guarda allWeatherData en el localStorage para futuras búsquedas
          localStorage.setItem(
            'allWeatherData',
            JSON.stringify(allWeatherData)
          );



          if (lastSearchedCity !== city) {
            localStorage.setItem('lastSearchedCity', city);
            this.lastSearchedCity.emit(city);
            this.onHistorial();
          }
        })
        .catch((error) => {
          console.error('Error fetching weather data:', error);
        });
    }
  }
  onHistorial() {
    // Obtén el nombre del usuario y la última ciudad buscada del localStorage
    let lastSearchedCity = localStorage.getItem('lastSearchedCity');
    if (lastSearchedCity) {
      let user = localStorage.getItem('user');

      if (user) {
        let userObj = JSON.parse(user);
        if (userObj && typeof userObj === 'object' && 'name' in userObj) {
          const userName = userObj.name;
          console.log(userName, lastSearchedCity);
          const timestamp = new Date();
          // Ahora puedes usar userName junto con lastSearchedCity para hacer la solicitud POST
          this.http
            .post('http://localhost:3000/registroHistorial', {
              Nombre: userName,
              SearchCity: lastSearchedCity,
              Fecha: timestamp,
            })
            .pipe(
              catchError((error) => {
                console.error('Error al registrar:', error);
                return throwError(error);
              })
            )
            .subscribe((response) => {
              console.log(
                'Datos enviados correctamente al historial: ',
                response
              );
            });
        }
      }
    }
  }
  handleSubmit(event: any) {
    event.preventDefault();
    let cityInputElement = document.querySelector(
      '#city-input'
    ) as HTMLInputElement;
    this.search(cityInputElement.value);
  }
  selectFormElement() {
    let form = document.querySelector('#search-form') as HTMLFormElement;
    form.addEventListener('submit', this.handleSubmit);
  }

  formatDate(timestamp: number) {
    let date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = date.getMinutes();

    let days = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miercoles',
      'Jueves',
      'Viernes',
      'Sabado',
    ];
    let day = days[date.getDay()];

    return `${day} ${hours}:${minutes}`;
  }

  formatDay(timestamp: number) {
    let date = new Date(timestamp * 1000);
    let day = date.getDay();
    let days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vi', 'Sa'];

    return days[day];
  }

  mapWeatherIcon(apiIcon: string): string {
    const iconMapping: { [index: string]: string } = {
      '01d': './assets/clear.png',
      '02d': './assets/partly_cloudy.png',
      '03d': './assets/clouds.png',
      '04d': './assets/clouds.png',
      '09d': './assets/rain.png',
      '10d': './assets/drizzle.png',
      '11d': './assets/thunder.png',
      '13d': './assets/snow.png',
      '50d': './assets/mist.png',
    };

    // Devuelve la ruta de la imagen personalizada o una ruta predeterminada
    return iconMapping[apiIcon] || './assets/default.png';
  }

  displayForecast(response: any) {
    let forecast = response.data.daily;
    let forecastElement = document.querySelector('#forecast');
    if (!forecastElement) {
      throw new Error('Forecast element not found');
    }

    let forecastHTML = `<div class="row">`;

    forecast.forEach((forecastDay: any, index: number) => {
      if (index < 5) {
        forecastHTML =
          forecastHTML +
          `
          <div class="col-2 ml-3">
            <div class="weather-forecast-date">${this.formatDay(
              forecastDay.dt
            )}</div>
            <img
              src="${this.mapWeatherIcon(forecastDay.weather[0].icon)}"
              alt=""
              width="42"
          />
            <div class="weather-forecast-temperatures">
              <span class="weather-forecast-temperature-max"> ${Math.round(
                forecastDay.temp.max
              )}° </span>
              <span class="weather-forecast-temperature-min"> ${Math.round(
                forecastDay.temp.min
              )}° </span>
            </div>
          </div>
        `;
      }
    });

    forecastHTML = forecastHTML + `</div>`;
    forecastElement.innerHTML = forecastHTML;
  }

  getForecast(coordinates: any) {
    let apiKey = 'cabdbda40038ba7d1165b953b1c7bd6c';
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(this.displayForecast);
  }

  displayTemperature(response: { data: any }) {
    let temperatureElement = document.querySelector(
      '#temperature'
    ) as HTMLElement;
    let cityElement = document.querySelector('#city');
    let humidityElement = document.querySelector('#humidity');
    let windElement = document.querySelector('#wind');
    let dateElement = document.querySelector('#date');
    let iconElement = document.querySelector('#icon') as HTMLImageElement;

    if (
      temperatureElement &&
      cityElement &&
      humidityElement &&
      windElement &&
      dateElement &&
      iconElement
    ) {
      let celsiusTemperature = response.data.main.temp;

      temperatureElement.innerHTML = Math.round(celsiusTemperature).toString();
      cityElement.innerHTML = response.data.name;
      humidityElement.innerHTML = response.data.main.humidity.toString();
      windElement.innerHTML = Math.round(
        response.data.wind.speed * 3.6
      ).toString();
      dateElement.innerHTML = this.formatDate(response.data.dt * 1000);

      iconElement.setAttribute('alt', response.data.weather[0].description);
      if (response.data.weather[0].main == 'Clear') {
        iconElement.src = './assets/clear.png';
      } else if (response.data.weather[0].main == 'Clouds') {
        iconElement.src = './assets/clouds.png';
      } else if (response.data.weather[0].main == 'Rain') {
        iconElement.src = './assets/rain.png';
      } else if (response.data.weather[0].main == 'Mist') {
        iconElement.src = './assets/mist.png';
      } else if (response.data.weather[0].main == 'Drizzle') {
        iconElement.src = './assets/drizzle.png';
      } else if (response.data.weather[0].main == 'Snow') {
        iconElement.src = './assets/snow.png';
      } else if (
        response.data.weather[0].main.toLowerCase() == 'thunderstorm'
      ) {
        iconElement.src = './assets/thunder.png';
      }
      this.getForecast(response.data.coord);
    }
  }
}
