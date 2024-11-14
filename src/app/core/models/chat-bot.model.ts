export interface Message {
    content: string;
    isBot: boolean;
    timestamp: Date;
  }
  
  export interface Chat {
    id: string;
    name: string;
    messages: Message[];
    createdAt: Date;
    lastUpdated: Date;
  }