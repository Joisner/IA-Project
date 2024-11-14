import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Chat, Message } from 'src/app/core/models/chat-bot.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private chats: Chat[] = [];
  private currentChatSubject = new BehaviorSubject<Chat | null>(null);
  currentChat$ = this.currentChatSubject.asObservable();

  constructor() {
    this.loadChatsFromStorage();
  }

  private loadChatsFromStorage() {
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
      this.chats = JSON.parse(savedChats);
    }
  }

  private saveChatsToStorage() {
    localStorage.setItem('chats', JSON.stringify(this.chats));
  }

  createNewChat(name: string): Chat {
    const newChat: Chat = {
      id: Date.now().toString(),
      name,
      messages: [],
      createdAt: new Date(),
      lastUpdated: new Date()
    };
    this.chats.push(newChat);
    this.saveChatsToStorage();
    this.setCurrentChat(newChat);
    return newChat;
  }

  getAllChats(): Chat[] {
    return this.chats;
  }

  setCurrentChat(chat: Chat) {
    this.currentChatSubject.next(chat);
  }

  addMessageToCurrentChat(message: Message) {
    const currentChat = this.currentChatSubject.value;
    if (currentChat) {
      currentChat.messages.push(message);
      currentChat.lastUpdated = new Date();
      this.saveChatsToStorage();
      this.currentChatSubject.next({...currentChat});
    }
  }

  deleteChat(chatId: string) {
    this.chats = this.chats.filter(chat => chat.id !== chatId);
    this.saveChatsToStorage();
    if (this.currentChatSubject.value?.id === chatId) {
      this.currentChatSubject.next(this.chats[0] || null);
    }
  }
}