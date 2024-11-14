import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { ViewChild, ElementRef } from '@angular/core';
@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [MaterialModule, CommonModule, ReactiveFormsModule],
  templateUrl: './chat-bot.component.html',
  styleUrl: './chat-bot.component.scss'
})
export class ChatBotComponent {
  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  messages: Message[] = [];
  messageForm: FormGroup;
  suggestions: string[] = [
    'Hola',
    '¿Cómo estás?',
    '¿Puedes ayudarme?',
    'Gracias'
  ];

  constructor(private snackBar: MatSnackBar) {
    this.messageForm = new FormGroup({
      message: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    // Mensaje de bienvenida
    this.addBotMessage('¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte?');
  }

  sendMessage() {
    if (this.messageForm.valid) {
      const userMessage = this.messageForm.get('message')?.value;
      this.addUserMessage(userMessage);
      this.messageForm.reset();
      
      // Simular respuesta del bot
      setTimeout(() => {
        this.simulateBotResponse(userMessage);
      }, 1000);
    }
  }

  private addUserMessage(content: string) {
    this.messages.push({
      content,
      isBot: false,
      timestamp: new Date()
    });
  }

  private addBotMessage(content: string) {
    this.messages.push({
      content,
      isBot: true,
      timestamp: new Date()
    });
  }

  private simulateBotResponse(userMessage: string) {
    // Aquí puedes implementar la lógica real de tu IA
    const responses = [
      'Entiendo lo que dices.',
      '¿Podrías darme más detalles?',
      'Déjame pensar en eso...',
      '¡Interesante pregunta!',
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    this.addBotMessage(randomResponse);
  }
}
interface Message {
  content: string;
  isBot: boolean;
  timestamp: Date;
}
