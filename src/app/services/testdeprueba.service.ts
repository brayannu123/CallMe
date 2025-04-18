import { Injectable } from '@angular/core';
import {Capacitor} from "@capacitor/core";

@Injectable({
  providedIn: 'root'
})
export class TestdepruebaService {

  constructor() { }

  async launchJitsiCall() {
    if (Capacitor.getPlatform() !== 'android') {
      console.warn('Esta función solo está disponible en Android.');
      return;
    }

    try {
      const result = await (window as any).Capacitor.Plugins.CallmePlugin.launchCall();
      console.log('Lanzamiento exitoso:', result);
    } catch (error) {
      console.error('Error al lanzar la llamada:', error);
    }
  }
}
