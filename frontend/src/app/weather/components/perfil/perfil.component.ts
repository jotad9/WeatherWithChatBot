import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Usuario } from '../../../interfaces/Usuario';
import { NavbarComponent } from '../navbar/navbar.component';
@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [NavbarComponent, FormsModule, HttpClientModule,RouterModule,CommonModule],
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {
  user!: Usuario;

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && Object.keys(user).length > 0) {
      this.user = user;
    }
  }

}
