import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLinkActive } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Usuario } from '../../../interfaces/Usuario';
declare var $: any;

interface LoginResponse {
  user: Usuario;
}
@Component({
  selector: 'modal',
  standalone: true,
  imports: [FormsModule, HttpClientModule, RouterLinkActive],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent implements AfterViewInit {
  @Output() isLoggin = new EventEmitter<void>();
  @Output() isVisible = new EventEmitter<void>();
  constructor(private http: HttpClient) {}

  @ViewChild('loginRegisterModal') loginRegisterModal!: ElementRef;

  user: Usuario = {
    name: '',
    email: '',
    password: '',
    city: '',
    age: 0,
  };

  onRegister() {
    this.http
      .post('http://localhost:3000/register', this.user)
      .pipe(
        catchError(error => {
          console.error('Error al registrar:', error);
          return throwError(error);
        })
      )
      .subscribe(() => {
        $(this.loginRegisterModal.nativeElement).modal('hide');
        localStorage.setItem('isLoggin','true');
        this.isLoggin.emit();
        localStorage.setItem('isVisible','true');
        this.isVisible.emit();
        localStorage.setItem('user', JSON.stringify(this.user));
      });
  }

  onLogin() {
    this.http
      .post<LoginResponse>('http://localhost:3000/login', this.user)
      .pipe(
        catchError(error => {
          console.error('Error al iniciar sesión:', error);
          return throwError(error);
        })
      )
      .subscribe((response) => {
        $(this.loginRegisterModal.nativeElement).modal('hide');
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('isLoggin','true');
        localStorage.setItem('isVisible','true');
        this.isVisible.emit();
        this.isLoggin.emit();
      });
  }

  ngAfterViewInit() {
    $(this.loginRegisterModal.nativeElement).modal('show');

    $('#showRegister').click(function () {
      $('#loginSection').hide();
      $('#registerSection').show();
    });

    $('#showLogin').click(function () {
      $('#registerSection').hide();
      $('#loginSection').show();
    });
  }
}
