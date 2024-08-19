import { CommonModule } from '@angular/common';
import {
    Component,
    ElementRef,
    HostListener,
    ViewChild
} from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { ModalComponent } from '../modal/modal.component';
declare var $: any;
@Component({
  selector: 'navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent  {
  @ViewChild('morado') morado!: ElementRef;
  @ViewChild('azul') azul!: ElementRef;
  @ViewChild('verde') verde!: ElementRef;
  @ViewChild('rojo') rojo!: ElementRef;
  @ViewChild('amarillo') amarillo!: ElementRef;
  @ViewChild('naranja') naranja!: ElementRef;
  @ViewChild('rosa') rosa!: ElementRef;
  @ViewChild(ModalComponent, { static: false }) modal!: ModalComponent;
  @HostListener('click', ['$event'])
  changeColor(event: Event) {
    const target = event.currentTarget as HTMLElement;
    if (target) {
      switch (target.id) {
        case 'morado':
          document.body.style.background =
            'linear-gradient(135deg, #d03fe6, #427ec7)';
          break;
        case 'azul':
          document.body.style.background =
            'linear-gradient(135deg, #3a7bd5, #3a6073)';
          break;
        case 'verde':
          document.body.style.background =
            'linear-gradient(135deg, #6ce891, #427ec7)';
          break;
        case 'rojo':
          document.body.style.background =
            'linear-gradient(135deg, #ea1919, #3c45f2)';
          break;
        case 'amarillo':
          document.body.style.background =
            'linear-gradient(135deg, #ffcc00, #b38f00)';
          break;
        case 'naranja':
          document.body.style.background =
            'linear-gradient(135deg, #ff6600, #b34700)';
          break;
        case 'rosa':
          document.body.style.background =
            'linear-gradient(135deg,  #ff0080, #d03fe6)';
          break;
      }
    }
  }

  logout() {
    // Establece el estado de inicio de sesión y visibilidad
    localStorage.setItem('isLoggin', 'false');
    localStorage.setItem('isVisible', 'false');
    // Muestra el modal de inicio de sesión/registro
    $(document).ready(function(){
      $('#loginRegisterModal').modal();
    });
    location.reload();
  }
}
