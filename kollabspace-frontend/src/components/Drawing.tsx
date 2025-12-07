import {useEffect, useRef, useState} from 'react';
import type {DrawingStroke, Point, DrawingTool, Canvas} from '../types/drawing';
import './Drawing.css';

interface DrawingProps {
  canvas: Canvas | null;
  strokes: DrawingStroke[];
  userName: string;
  isConnected: boolean;
  onSendStroke: (points: Point[], color: string, width: number) => void;
  onDeleteStroke: (strokeId: string) => void;
  onClearCanvas: () => void;
}

export function Drawing({
  canvas,
  strokes,
  userName,
  isConnected,
  onSendStroke,
  onDeleteStroke,
  onClearCanvas,
}: DrawingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [currentTool, setCurrentTool] = useState<DrawingTool>('pen');
  const [currentColor, setCurrentColor] = useState('#ebdbb2'); // Gruvbox foreground
  const [currentWidth, setCurrentWidth] = useState(2);
  const [hoveredStrokeId, setHoveredStrokeId] = useState<string | null>(null);

  // Redraw canvas whenever strokes change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#282828'; // Gruvbox background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render all strokes
    strokes.forEach((stroke) => {
      renderStroke(ctx, stroke, stroke.id === hoveredStrokeId);
    });
  }, [strokes, hoveredStrokeId]);

  const renderStroke = (
    ctx: CanvasRenderingContext2D,
    stroke: DrawingStroke,
    isHovered: boolean = false
  ) => {
    if (stroke.points.length === 0) return;

    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Highlight hovered stroke (for eraser)
    if (isHovered) {
      ctx.shadowColor = '#fabd2f'; // Gruvbox yellow
      ctx.shadowBlur = 10;
    } else {
      ctx.shadowBlur = 0;
    }

    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

    for (let i = 1; i < stroke.points.length; i++) {
      ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
    }

    ctx.stroke();
    ctx.shadowBlur = 0; // Reset shadow
  };

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return {x: 0, y: 0};

    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.floor(e.clientX - rect.left),
      y: Math.floor(e.clientY - rect.top),
    };
  };

  const findStrokeAtPoint = (point: Point): string | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Check strokes in reverse order (top to bottom)
    for (let i = strokes.length - 1; i >= 0; i--) {
      const stroke = strokes[i];
      if (isPointNearStroke(point, stroke, ctx)) {
        return stroke.id;
      }
    }

    return null;
  };

  const isPointNearStroke = (
    point: Point,
    stroke: DrawingStroke,
    ctx: CanvasRenderingContext2D
  ): boolean => {
    const threshold = Math.max(stroke.width, 10); // At least 10px hit area

    for (let i = 0; i < stroke.points.length; i++) {
      const strokePoint = stroke.points[i];
      const distance = Math.sqrt(
        Math.pow(point.x - strokePoint.x, 2) + Math.pow(point.y - strokePoint.y, 2)
      );

      if (distance <= threshold) {
        return true;
      }
    }

    return false;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvas || !isConnected) return;

    const point = getCanvasCoordinates(e);

    if (currentTool === 'eraser') {
      const strokeId = findStrokeAtPoint(point);
      if (strokeId) {
        onDeleteStroke(strokeId);
      }
    } else {
      setIsDrawing(true);
      setCurrentStroke([point]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvas) return;

    const point = getCanvasCoordinates(e);

    if (currentTool === 'eraser') {
      // Highlight stroke under cursor
      const strokeId = findStrokeAtPoint(point);
      setHoveredStrokeId(strokeId);
    } else if (isDrawing) {
      const newStroke = [...currentStroke, point];
      setCurrentStroke(newStroke);

      // Draw locally (optimistic update)
      const canvasEl = canvasRef.current;
      if (!canvasEl) return;

      const ctx = canvasEl.getContext('2d');
      if (!ctx || currentStroke.length === 0) return;

      ctx.strokeStyle = currentColor;
      ctx.lineWidth = currentWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const prev = currentStroke[currentStroke.length - 1];
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && currentStroke.length > 0) {
      onSendStroke(currentStroke, currentColor, currentWidth);
      setCurrentStroke([]);
    }
    setIsDrawing(false);
  };

  const handleMouseLeave = () => {
    if (isDrawing && currentStroke.length > 0) {
      onSendStroke(currentStroke, currentColor, currentWidth);
      setCurrentStroke([]);
    }
    setIsDrawing(false);
    setHoveredStrokeId(null);
  };

  const handleClearCanvas = () => {
    if (window.confirm('Clear the entire canvas for everyone?')) {
      onClearCanvas();
    }
  };

  if (!canvas) {
    return (
      <div className="drawing-container">
        <div className="drawing-empty">
          <p>Select a canvas from the sidebar to start drawing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="drawing-container">
      <div className="drawing-header">
        <h2>{canvas.name}</h2>
        <div className="connection-status">
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`} />
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      <div className="drawing-toolbar">
        <div className="tool-group">
          <label className="tool-label">Tool:</label>
          <button
            className={`tool-button ${currentTool === 'pen' ? 'active' : ''}`}
            onClick={() => setCurrentTool('pen')}
            title="Pen tool"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 19l7-7 3 3-7 7-3-3z" />
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              <path d="M2 2l7.586 7.586" />
            </svg>
            Pen
          </button>
          <button
            className={`tool-button ${currentTool === 'eraser' ? 'active' : ''}`}
            onClick={() => setCurrentTool('eraser')}
            title="Eraser tool (click strokes to delete)"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 20H8l-4-4 8-8 8 8-4 4z" />
              <path d="M12 12l4 4" />
            </svg>
            Eraser
          </button>
        </div>

        {currentTool === 'pen' && (
          <>
            <div className="tool-group">
              <label className="tool-label" htmlFor="color-picker">
                Color:
              </label>
              <input
                id="color-picker"
                type="color"
                value={currentColor}
                onChange={(e) => setCurrentColor(e.target.value)}
                className="color-picker"
              />
            </div>

            <div className="tool-group">
              <label className="tool-label" htmlFor="width-slider">
                Width: {currentWidth}px
              </label>
              <input
                id="width-slider"
                type="range"
                min="1"
                max="20"
                value={currentWidth}
                onChange={(e) => setCurrentWidth(Number(e.target.value))}
                className="width-slider"
              />
            </div>
          </>
        )}

        <div className="tool-group">
          <button className="clear-button" onClick={handleClearCanvas} title="Clear entire canvas">
            Clear Canvas
          </button>
        </div>
      </div>

      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={1200}
          height={700}
          className={`drawing-canvas ${currentTool === 'eraser' ? 'eraser-cursor' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        />
      </div>

      <div className="drawing-footer">
        <span className="user-info">Drawing as: {userName}</span>
        <span className="stroke-count">{strokes.length} strokes</span>
      </div>
    </div>
  );
}
