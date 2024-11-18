import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule} from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [ MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatListModule,
    MatDialogModule,
    ReactiveFormsModule,
    CommonModule,
    MaterialModule,
    FormsModule],
  templateUrl: './chat-bot.component.html',
  styleUrl: './chat-bot.component.scss'
})
export class ChatBotComponent {
  conversations: Conversation[] = [
    { id: 1, name: 'Conversation 1', lastMessage: 'Hello there!', timestamp: new Date() },
    { id: 2, name: 'Conversation 2', lastMessage: 'How are you?', timestamp: new Date() },
  ];

  selectedConversation: Conversation | null = null;
  messages: Message[] = [];
  newMessage: string = '';

  selectConversation(conversation: Conversation) {
    this.selectedConversation = conversation;
    // Aquí cargarías los mensajes de la conversación seleccionada
    this.messages = [
      { text: 'Hi there!', sender: 'bot', timestamp: new Date() },
      { text: 'Hello! How can I help you today?', sender: 'user', timestamp: new Date() },
    ];
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({
        text: this.newMessage,
        sender: 'user',
        timestamp: new Date()
      });
      this.newMessage = '';
      // Aquí simularíamos una respuesta del bot
      setTimeout(() => {
        this.messages.push({
          text: 'Thanks for your message. How else can I assist you?',
          sender: 'bot',
          timestamp: new Date()
        });
      }, 1000);
    }
  }
}

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: Date;
}