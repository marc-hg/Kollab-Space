import type {IMessage} from '@stomp/stompjs';
import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type {
  DrawingStroke,
  DrawingStrokeRequest,
  DeleteStrokeRequest,
  DeleteStrokeMessage,
  ClearCanvasMessage,
} from '../types/drawing';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

export class DrawingService {
  private readonly client: Client | null = null;
  private subscriptions: Map<string, any> = new Map();

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS(`${BACKEND_URL}/ws`) as any,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.log('STOMP Drawing: ' + str);
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
        console.log('Connected to Drawing WebSocket');
        onConnect();
        resolve();
      };

      this.client.onStompError = (frame) => {
        console.error('STOMP Drawing error:', frame);
        onError(frame);
        reject(frame);
      };

      this.client.onWebSocketError = (event) => {
        console.error('Drawing WebSocket error:', event);
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

  subscribeToCanvas(
    canvasId: string,
    onStroke: (stroke: DrawingStroke) => void,
    onDelete: (message: DeleteStrokeMessage) => void,
    onClear: (message: ClearCanvasMessage) => void
  ): void {
    if (!this.client || !this.client.connected) {
      console.error('Cannot subscribe: client not connected');
      return;
    }

    // Unsubscribe from previous subscription if exists
    const existingSubscription = this.subscriptions.get(canvasId);
    if (existingSubscription) {
      existingSubscription.unsubscribe();
    }

    // Subscribe to canvas topic
    const subscription = this.client.subscribe(
      `/topic/canvas/${canvasId}`,
      (message: IMessage) => {
        const data = JSON.parse(message.body);

        // Determine message type based on structure
        if (data.points && data.color) {
          // It's a DrawingStroke
          onStroke(data as DrawingStroke);
        } else if (data.strokeId && !data.canvasId) {
          // It's a DeleteStrokeMessage
          onDelete(data as DeleteStrokeMessage);
        } else if (data.canvasId && !data.strokeId) {
          // It's a ClearCanvasMessage
          onClear(data as ClearCanvasMessage);
        }
      }
    );

    this.subscriptions.set(canvasId, subscription);
    console.log(`Subscribed to canvas: ${canvasId}`);
  }

  unsubscribeFromCanvas(canvasId: string): void {
    const subscription = this.subscriptions.get(canvasId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(canvasId);
      console.log(`Unsubscribed from canvas: ${canvasId}`);
    }
  }

  sendStroke(canvasId: string, stroke: DrawingStrokeRequest): void {
    if (!this.client || !this.client.connected) {
      console.error('Cannot send stroke: client not connected');
      return;
    }

    this.client.publish({
      destination: `/app/canvas/${canvasId}/stroke`,
      body: JSON.stringify(stroke),
    });
  }

  deleteStroke(canvasId: string, strokeId: string): void {
    if (!this.client || !this.client.connected) {
      console.error('Cannot delete stroke: client not connected');
      return;
    }

    const deleteRequest: DeleteStrokeRequest = {strokeId};
    this.client.publish({
      destination: `/app/canvas/${canvasId}/delete`,
      body: JSON.stringify(deleteRequest),
    });
  }

  clearCanvas(canvasId: string): void {
    if (!this.client || !this.client.connected) {
      console.error('Cannot clear canvas: client not connected');
      return;
    }

    this.client.publish({
      destination: `/app/canvas/${canvasId}/clear`,
      body: JSON.stringify({}),
    });
  }

  async fetchCanvasHistory(canvasId: string): Promise<DrawingStroke[]> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/canvas/${canvasId}/strokes`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching canvas history:', error);
      return [];
    }
  }

  isConnected(): boolean {
    return this.client?.connected || false;
  }
}

export const drawingService = new DrawingService();
