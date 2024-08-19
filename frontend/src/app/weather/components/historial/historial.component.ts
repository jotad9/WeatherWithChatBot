import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css',
})
export class HistorialComponent implements OnInit {
  historial: any[] = [];
  userName!: string;
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.historicos();
  }

  historicos() {
    let user = localStorage.getItem('user');
    if (user) {
      let userObj = JSON.parse(user);
      this.userName = userObj.name;
      const params = new HttpParams().set('Nombre', this.userName);
      this.http
        .get(`http://localhost:3000/historial`, { params })
        .subscribe((response: any) => {
          console.log(response);
          this.historial = response.user;
          console.log(this.historial);
          this.cdr.detectChanges();
        });
    }
  }
}
