import { Component } from '@angular/core';
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
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [MatIconModule,
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

  trackByConversationId(index: number, conversation: Conversation): number {
    return conversation.id;
  }

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
      this.scrollToBottom();
      // Aquí simularíamos una respuesta del bot
      setTimeout(() => {
        this.messages.push({
          text: 'Thanks for your message. How else can I assist you?',
          sender: 'bot',
          timestamp: new Date()
        });
        this.scrollToBottom();
      }, 1000);
    }
  }
  deleteConversation(conversation: Conversation) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this chat? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.conversations = this.conversations.filter(c => c.id !== conversation.id);
        Swal.fire(
          'Deleted!',
          'The chat has been successfully deleted.',
          'success'
        );
        this.selectedConversation = null;
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Opcional: Si el usuario cancela, muestra un mensaje
        Swal.fire(
          'Cancelled',
          'Your chat is safe!',
          'info'
        );
      }
    });
  }

  createNewConversation() {
    // Logic to create a new conversation
    const newConversation: Conversation = {
      id: this.conversations.length + 1,
      name: 'New Conversation',
      lastMessage: '',
      timestamp: new Date()
    };
    this.conversations.push(newConversation);
    this.selectConversation(newConversation);
  }
  newChat() {
    const newConversation: Conversation = {
      id: this.conversations.length + 1,
      lastMessage: 'New Conversation',
      name: '',
      timestamp: new Date()
    };
    this.conversations.push(newConversation);
    this.selectConversation(newConversation);
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const chatMessages = document.querySelector('.chat-messages');
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }, 100);
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