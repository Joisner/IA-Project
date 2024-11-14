import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ChatService } from 'src/app/services/chat-bot/chat-bot.service';
import { Chat, Message } from 'src/app/core/models/chat-bot.model';
import { MaterialModule } from 'src/app/material.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-chips',
  standalone: true,
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
  imports: [
    MatIconModule,
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
    MaterialModule
  ]
})
export class AppChipsComponent {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  
  messageForm: FormGroup;
  currentChat: Chat | null = null;
  chats: Chat[] = [];
  private subscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private chatService: ChatService,
    private dialog: MatDialog
  ) {
    this.messageForm = this.fb.group({
      message: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.chats = this.chatService.getAllChats();
    this.subscription = this.chatService.currentChat$.subscribe(chat => {
      this.currentChat = chat;
      setTimeout(() => this.scrollToBottom(), 0);
    });

    if (this.chats.length === 0) {
      this.chatService.createNewChat('New Chat');
    } else {
      this.chatService.setCurrentChat(this.chats[0]);
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  sendMessage() {
    if (this.messageForm.valid && this.currentChat) {
      const message: Message = {
        content: this.messageForm.value.message,
        isBot: false,
        timestamp: new Date()
      };
      
      this.chatService.addMessageToCurrentChat(message);
      this.messageForm.reset();
      
      // Simulate bot response
      setTimeout(() => {
        const botMessage: Message = {
          content: 'This is a simulated response from the AI assistant.',
          isBot: true,
          timestamp: new Date()
        };
        this.chatService.addMessageToCurrentChat(botMessage);
      }, 1000);
    }
  }

  selectChat(chat: Chat) {
    this.chatService.setCurrentChat(chat);
  }

  deleteChat(chatId: string, event: Event) {
    event.stopPropagation();
    this.chatService.deleteChat(chatId);
    this.chats = this.chatService.getAllChats();
  }

  openNewChatDialog() {
    const chatName = prompt('Enter chat name:');
    if (chatName) {
      this.chatService.createNewChat(chatName);
      this.chats = this.chatService.getAllChats();
    }
  }

  private scrollToBottom() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = 
        this.scrollContainer.nativeElement.scrollHeight;
    }
  }
}