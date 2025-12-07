export interface ChatMessage {
  id: string;
  roomId: string;
  userName: string;
  text: string;
  timestamp: number;
}

export interface ChatMessageRequest {
  userName: string;
  text: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  unreadCount?: number;
}

export type AppType = 'chat' | 'drawing' | 'docs';
