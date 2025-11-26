import { Client } from '@stomp/stompjs';
import type { IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { ChatMessage, ChatMessageRequest } from '../types/chat';

const BACKEND_URL = 'http://localhost:8080';

export class ChatService {
  private client: Client | null = null;
  private subscriptions: Map<string, any> = new Map();

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS(`${BACKEND_URL}/ws`) as any,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.log('STOMP: ' + str);
      },
    });
  }

  connect(
    onConnect: () => void,
    onError: (error: any) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.client) {
        reject(new Error('Client not initialized'));
        return;
      }

      this.client.onConnect = () => {
        console.log('Connected to WebSocket');
        onConnect();
        resolve();
      };

      this.client.onStompError = (frame) => {
        console.error('STOMP error:', frame);
        onError(frame);
        reject(frame);
      };

      this.client.onWebSocketError = (event) => {
        console.error('WebSocket error:', event);
        onError(event);
      };

      this.client.activate();
    });
  }

  disconnect(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions.clear();

    if (this.client) {
      this.client.deactivate();
    }
  }

  subscribeToRoom(
    roomId: string,
    onMessage: (message: ChatMessage) => void
  ): void {
    if (!this.client || !this.client.connected) {
      console.error('Cannot subscribe: client not connected');
      return;
    }

    // Unsubscribe from previous subscription if exists
    const existingSubscription = this.subscriptions.get(roomId);
    if (existingSubscription) {
      existingSubscription.unsubscribe();
    }

    // Subscribe to room topic
    const subscription = this.client.subscribe(
      `/topic/chat/${roomId}`,
      (message: IMessage) => {
        const chatMessage: ChatMessage = JSON.parse(message.body);
        onMessage(chatMessage);
      }
    );

    this.subscriptions.set(roomId, subscription);
    console.log(`Subscribed to room: ${roomId}`);
  }

  unsubscribeFromRoom(roomId: string): void {
    const subscription = this.subscriptions.get(roomId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(roomId);
      console.log(`Unsubscribed from room: ${roomId}`);
    }
  }

  sendMessage(roomId: string, message: ChatMessageRequest): void {
    if (!this.client || !this.client.connected) {
      console.error('Cannot send message: client not connected');
      return;
    }

    this.client.publish({
      destination: `/app/chat/${roomId}/send`,
      body: JSON.stringify(message),
    });
  }

  async fetchChatHistory(roomId: string): Promise<ChatMessage[]> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/chat/${roomId}/history`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const messages: ChatMessage[] = await response.json();
      return messages;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
  }

  isConnected(): boolean {
    return this.client?.connected || false;
  }
}

export const chatService = new ChatService();
