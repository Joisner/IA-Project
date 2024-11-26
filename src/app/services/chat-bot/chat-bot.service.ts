import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Chat, Message } from 'src/app/core/models/chat-bot.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private chats: Chat[] = [];
  private currentChatSubject = new BehaviorSubject<Chat | null>(null);
  currentChat$ = this.currentChatSubject.asObservable();

  constructor(private http: HttpClient) {
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
      this.currentChatSubject.next({ ...currentChat });
    }
  }

  deleteChat(chatId: string) {
    this.chats = this.chats.filter(chat => chat.id !== chatId);
    this.saveChatsToStorage();
    if (this.currentChatSubject.value?.id === chatId) {
      this.currentChatSubject.next(this.chats[0] || null);
    }
  }

  public sendPromptChat(model: string, data: object): Observable<any> {
    try {
      debugger;
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' })
      const modelParam = new HttpParams().set('model', model)
      return this.http.post(`http://192.168.1.36:5000/chat`, data, { params: modelParam, headers: headers }).pipe(
        map((message) => {
          debugger;
          return message
        })
      );
    }
    catch (error) {
      throw new Error(`${error}`)
    }
  }

}