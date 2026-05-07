import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <h1>Conexión Angular + .NET</h1>
    <p>Mira la consola del navegador para ver la respuesta de la API.</p>
  `
})
export class AppComponent implements OnInit {
  private http = inject(HttpClient);

  ngOnInit() {
    // Al usar "/api/weatherforecast", el proxy se encarga del resto
    this.http.get('/api/weatherforecast').subscribe({
      next: (data) => console.log('Datos recibidos de la API:', data),
      error: (err) => console.error('Error al conectar:', err)
    });
  }
}