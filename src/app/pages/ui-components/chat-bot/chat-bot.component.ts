import { Component, ElementRef, model, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { ChatService } from 'src/app/services/chat-bot/chat-bot.service';
import Swal from 'sweetalert2';
import { marked } from 'marked';
import hljs from 'highlight.js';

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [ReactiveFormsModule,
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
  private typingInterval: any;
  private currentTypingMessage: Message | null = null;

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
    this.typingInterval = setInterval(() => {
      if (currentIndex < text.length) {
        callback(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        this.stopTyping();
      }
    }, 20); // Velocidad de escritura
  }



  stopTyping() {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
      this.isTyping = false;
      if (this.currentTypingMessage) {
        this.currentTypingMessage.typing = false;
        this.renderMarkdown(this.currentTypingMessage.text).then(renderedText => {
          if (this.currentTypingMessage) {
            this.currentTypingMessage.renderedText = renderedText;
            this.scrollToBottom();
          }
        });
        this.currentTypingMessage = null;
      }
    }
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

  assistants: string[] = ['GlutaBot', 'Grok', 'Writing Aid'];
  selectedAssistant: string = 'GlutaBot';
  sendMessage() {
    debugger;
    if (this.newMessage.trim()) {
      // Mapeo de asistentes y modelos
      const assistantModelMapping = {
        'GlutaBot': {
          assistant: 'glutaBot',
          model: 'gpt-4'
        },

        'Grok': {
          assistant: 'grok',
          model: 'grok-beta'
        },

        'Writing Aid': {
          assistant: 'writing-aid',
          model: 'gpt-3.5-turbo'
        }
      };
      // Obtener el objeto de asistente y modelo seleccionado, con valor predeterminado
      const selectedAssistant = assistantModelMapping[this.selectedAssistant as keyof typeof assistantModelMapping] || assistantModelMapping['GlutaBot'];
      // Add user message
      const userMessage: Message = {
        text: this.newMessage,
        sender: 'user',
        timestamp: new Date(),
        typing: false
      };

      this.messages.push(userMessage);
      const prompt = this.newMessage;
      this.newMessage = '';
      this.scrollToBottom();

      // Prepare for bot response
      const botMessage: Message = {
        text: '...',
        sender: 'bot',
        timestamp: new Date(),
        typing: true
      };
      this.messages.push(botMessage);

      // Indicador de escritura
      this.isTyping = true;

      // Send prompt to service
      this.chatService.sendPromptChat(selectedAssistant.assistant, selectedAssistant.model, { prompt: prompt })
        .subscribe({
          next: (response) => {
            this.messages.pop();
            if (response && response.data) {
              this.addBotMessageWithTypingEffect(response.data).then(() => {
                this.isTyping = false;
              });
            } else {
              this.addBotMessageWithTypingEffect('Lo siento, no fue posible responder en este momento. Por favor, intenta de nuevo más tarde.').then(() => {
                this.isTyping = false;
              });
            }
          },
          error: (error) => {
            console.error('Error in chat response:', error);
            // Remove the typing message
            this.messages.pop();

            // Add error message
            this.addBotMessageWithTypingEffect('Hubo un error al obtener la respuesta. Por favor inténtalo de nuevo.');
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

    this.currentTypingMessage = botMessage;



    await new Promise(resolve => setTimeout(resolve, 1000));



    return new Promise<void>((resolve) => {

      let index = 0;

      this.typingInterval = setInterval(async () => {

        if (index < text.length) {

          botMessage.text += text[index];

          index++;



          botMessage.renderedText = await this.renderMarkdown(botMessage.text)

          this.scrollToBottom();

        } else {

          this.stopTyping();

          resolve();

        }

      }, 20);

    });

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