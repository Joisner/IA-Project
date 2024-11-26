import { Component, ElementRef, model, OnInit, ViewChild } from '@angular/core';
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
import { ChatService } from 'src/app/services/chat-bot/chat-bot.service';
import Swal from 'sweetalert2';
import { marked } from 'marked';
import hljs from 'highlight.js';

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
export class ChatBotComponent implements OnInit {
  @ViewChild('chatMessages') chatMessages!: ElementRef;
  conversations: Conversation[] = [
    { id: 1, name: 'Conversation 1', lastMessage: 'Hello there!', timestamp: new Date() },
    { id: 2, name: 'Conversation 2', lastMessage: 'How are you?', timestamp: new Date() },
  ];

  selectedConversation: Conversation | null = null;
  messages: Message[] = [];
  newMessage: string = '';
  isTyping: boolean = false;

  constructor(private chatService: ChatService) {

  }

  ngOnInit(): void {
    debugger;
    const renderer = new marked.Renderer();

    // Sobrescribir el método `code` del renderer
    renderer.code = ({ text, lang = 'plaintext' }) => {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      const highlighted = hljs.highlight(text, { language: language || 'plaintext' }).value;
      return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
    };

    // Configurar las opciones globales de `marked`
    marked.use({
      renderer, // Usa el renderer personalizado
    });
  }

  async renderMarkdown(text: string): Promise<string> {
    debugger;
    return marked.parse(text);
  }

  typeText(text: string, callback: (partialText: string) => void) {
    debugger;
    this.isTyping = true;
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < text.length) {
        callback(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        this.isTyping = false;
      }
    }, 20); // Velocidad de escritura
  }

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
    this.scrollToBottom();
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      // Agregar mensaje del usuario
      const userMessage: Message = {
        text: this.newMessage,
        sender: 'user',
        timestamp: new Date()
      };
      this.messages.push(userMessage);
      
      // Preparar para la respuesta del bot con un mensaje de typing
      const botTypingMessage: Message = {
        text: '...',
        sender: 'bot',
        timestamp: new Date()
      };
      this.messages.push(botTypingMessage);
      
      const prompt = this.newMessage;
      this.newMessage = '';
      this.scrollToBottom();
  
      // Enviar prompt al servicio
      this.chatService.sendPromptChat('grok-beta', { prompt: prompt })
        .subscribe({
          next: (response) => {
            // Eliminar el mensaje de "typing"
            this.messages = this.messages.filter(m => m.text !== '...');
            
            // Variable para almacenar el texto completo
            let fullBotResponse = response.data;
            
            // Interpolar la respuesta del bot
            this.typeText(fullBotResponse, (partialText) => {
              const botMessage: Message = {
                text: partialText,
                sender: 'bot',
                timestamp: new Date()
              };
              
              // Reemplazar el último mensaje del bot con el texto parcial
              const existingBotMessageIndex = this.messages.findLastIndex(m => m.sender === 'bot');
              if (existingBotMessageIndex !== -1) {
                this.messages[existingBotMessageIndex] = botMessage;
              } else {
                this.messages.push(botMessage);
              }
              
              this.scrollToBottom();
            });
  
            // Una vez terminada la interpolación, agregar el mensaje completo
            setTimeout(() => {
              const finalBotMessage: Message = {
                text: fullBotResponse,
                sender: 'bot',
                timestamp: new Date()
              };
              
              // Reemplazar el último mensaje parcial con el mensaje completo
              this.messages[this.messages.length - 1] = finalBotMessage;
              this.scrollToBottom();
            }, fullBotResponse.length * 20 + 100); // Tiempo basado en la velocidad de escritura
          },
          error: (error) => {
            console.error('Error en la respuesta del chat:', error);
            // Eliminar el mensaje de typing
            this.messages = this.messages.filter(m => m.text !== '...');
            
            // Agregar mensaje de error
            const errorMessage: Message = {
              text: 'Hubo un error al obtener la respuesta. Por favor, inténtalo de nuevo.',
              sender: 'bot',
              timestamp: new Date()
            };
            this.messages.push(errorMessage);
            this.scrollToBottom();
          }
        });
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