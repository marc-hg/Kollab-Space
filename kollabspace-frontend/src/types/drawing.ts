export interface Point {
  x: number;
  y: number;
}

export interface DrawingStroke {
  id: string;
  canvasId: string;
  points: Point[];
  color: string;
  width: number;
  userId: string;
  timestamp: number;
}

export interface DrawingStrokeRequest {
  canvasId: string;
  points: Point[];
  color: string;
  width: number;
  userId: string;
}

export interface DeleteStrokeRequest {
  strokeId: string;
}

export interface DeleteStrokeMessage {
  strokeId: string;
}

export interface ClearCanvasMessage {
  canvasId: string;
}

export interface Canvas {
  id: string;
  name: string;
}

export type DrawingTool = 'pen' | 'eraser';
