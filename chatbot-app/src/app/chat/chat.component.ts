import { Component } from '@angular/core';
import { ChatbotService } from '../services/chatbot.service'; 

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  messages: { text: string; sender: string; date: Date; image: string }[] = [];

  userInput: string = '';
  userName: string = 'Usuario';
  botName: string = 'Chatbot';

  constructor(private chatbotService: ChatbotService) {}

  sendMessage() {
    if (this.userInput.trim()) {
      // Mensaje del usuario con fecha y avatar
      this.messages.push({
        text: this.userInput,
        sender: this.userName,
        date: new Date(),
        image: 'assets/user-avatar.png', // Ruta de la imagen del usuario
      });

      // Obtener respuesta del bot usando el servicio
      const botResponse = this.chatbotService.getBotResponse(this.userInput);

      // Respuesta del bot
      setTimeout(() => {
        this.messages.push({
          text: botResponse,
          sender: this.botName,
          date: new Date(),
          image: 'assets/bot-avatar.png', // Ruta de la imagen del bot
        });
      }, 1000);

      this.userInput = ''; // Limpiar input
    }
  }
}
