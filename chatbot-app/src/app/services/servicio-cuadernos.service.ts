import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ServicioCuadernosService {
  cuadernoSeleccionadoActualmente!: number;

  constructor() {}
  setItem(index: number): void {
    localStorage.setItem('cuadernoSeleccionado', index.toString());
  }

  getItem(): number | null {
    const storedValue = localStorage.getItem('cuadernoSeleccionado');
    return storedValue !== null ? +storedValue : null;
  }
}
