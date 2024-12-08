import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  getBotResponse(userMessage: string): string {
    // Lógica para obtener la respuesta del bot
    if (userMessage.toLowerCase().includes('hola')) {
      return '¡Hola! ¿Cómo puedo ayudarte hoy?';
    }
    return 'Lo siento, no entendí tu mensaje.';
  }
}
