import { Routes } from '@angular/router';
import { StarterComponent } from './starter/starter.component';
import { ChatBotComponent } from './ui-components/chat-bot/chat-bot.component';
import { AppChipsComponent } from './ui-components/chips/chips.component';
import { PaymentGatewayComponent } from './ui-components/payment-gateway/payment-gateway.component';
export const PagesRoutes: Routes = [
  {
    path: '',
    component: ChatBotComponent,
    data: {
      title: 'Starter',
      urls: [
        { title: 'Dashboard', url: '/chat-bot' },
        { title: 'Starter' },
      ],
    },
  },
  {
    path: 'chat-bot',
    component: ChatBotComponent,
    data: {
      title: 'Chat',
      urls: [
        { title: 'Chat', url: '/chat-bot' },
        { title: 'Chat Bot' },
      ],
    },
  },
  {
    path: 'chat-bot-v2',
    component: AppChipsComponent,
    data: {
      title: 'Chat',
      urls: [
        { title: 'Chat', url: '/chat-bot' },
        { title: 'Chat Bot' },
      ],
    },
  },
];
