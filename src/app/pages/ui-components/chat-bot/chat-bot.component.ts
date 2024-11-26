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

  trackByMessage(index: number, message: Message): number {
    return index;
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
      // Add user message
      const userMessage: Message = {
        text: this.newMessage,
        sender: 'user',
        timestamp: new Date(),
        typing: false
      };
      this.messages.push(userMessage);

      // Prepare for bot response
      const botTypingMessage: Message = {
        text: '...',
        sender: 'bot',
        timestamp: new Date(),
        typing: true
      };
      this.messages.push(botTypingMessage);

      const prompt = this.newMessage;
      this.newMessage = '';
      this.scrollToBottom();

      // Send prompt to service
      this.chatService.sendPromptChat('grok-beta', { prompt: prompt })
        .subscribe({
          next: (response) => {
            // Remove the typing message
            this.messages.pop();

            // Add the bot's response with typing effect
            this.addBotMessageWithTypingEffect(response.data);
          },
          error: (error) => {
            console.error('Error in chat response:', error);

            // Remove the typing message
            this.messages.pop();

            // Add error message
            const errorMessage: Message = {
              text: 'There was an error getting the response. Please try again.',
              sender: 'bot',
              timestamp: new Date(),
              typing: false
            };
            this.messages.push(errorMessage);

            this.scrollToBottom();
          }
        });
    }
  }

  async addBotMessageWithTypingEffect(text: string) {
    const botMessage: Message = {
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      typing: true
    };
    this.messages.push(botMessage);

    await new Promise(resolve => setTimeout(resolve, 1000));

    let index = 0;
    const intervalId = setInterval(async () => {
      if (index < text.length) {
        botMessage.text += text[index];
        index++;

        botMessage.renderedText = await this.renderMarkdown(botMessage.text)
        this.scrollToBottom();
      } else {
        clearInterval(intervalId);
        botMessage.typing = false;
        botMessage.renderedText = await this.renderMarkdown(botMessage.text);
        this.scrollToBottom();
      }
    }, 20); // Adjust the interval (in milliseconds) to control typing speed
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
  typing?: boolean;
  renderedText?: string;
}

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: Date;
}