import { useState } from 'react';
import type {AppType, ChatRoom} from '../types/chat';
import type {Canvas} from '../types/drawing';
import './Sidebar.css';

interface SidebarProps {
  currentApp: AppType;
  onAppChange: (app: AppType) => void;
  rooms: ChatRoom[];
  currentRoom: string | null;
  onRoomChange: (roomId: string) => void;
  onJoinRoom: (roomId: string) => void;
  canvases: Canvas[];
  currentCanvas: string | null;
  onCanvasChange: (canvasId: string) => void;
  onJoinCanvas: (canvasId: string) => void;
}

export default function Sidebar({
  currentApp,
  onAppChange,
  rooms,
  currentRoom,
  onRoomChange,
  onJoinRoom,
  canvases,
  currentCanvas,
  onCanvasChange,
  onJoinCanvas,
}: SidebarProps) {
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [newRoomId, setNewRoomId] = useState('');
  const [showJoinCanvasDialog, setShowJoinCanvasDialog] = useState(false);
  const [newCanvasId, setNewCanvasId] = useState('');

  const handleJoinRoom = () => {
    if (newRoomId.trim()) {
      onJoinRoom(newRoomId.trim());
      setNewRoomId('');
      setShowJoinDialog(false);
    }
  };

  const handleJoinCanvas = () => {
    if (newCanvasId.trim()) {
      onJoinCanvas(newCanvasId.trim());
      setNewCanvasId('');
      setShowJoinCanvasDialog(false);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-apps">
        <button
          className={`app-button ${currentApp === 'chat' ? 'active' : ''}`}
          onClick={() => onAppChange('chat')}
          title="Chat"
        >
          Chat
        </button>
        <button
          className={`app-button ${currentApp === 'drawing' ? 'active' : ''}`}
          onClick={() => onAppChange('drawing')}
          title="Drawing"
        >
          Drawing
        </button>
        <button
          className={`app-button ${currentApp === 'docs' ? 'active' : ''}`}
          onClick={() => onAppChange('docs')}
          title="Docs"
          disabled
        >
          Docs
        </button>
      </div>

      <div className="sidebar-divider" />

      <div className="sidebar-content">
        {currentApp === 'chat' && (
          <>
            <div className="sidebar-header">
              <span className="sidebar-title">Rooms</span>
              <button
                className="join-room-button"
                onClick={() => setShowJoinDialog(true)}
                title="Join/Create Room"
              >
                +
              </button>
            </div>

            <div className="room-list">
              {rooms.map((room) => (
                <button
                  key={room.id}
                  className={`room-item ${currentRoom === room.id ? 'active' : ''}`}
                  onClick={() => onRoomChange(room.id)}
                >
                  <span className="room-name"># {room.name}</span>
                  {room.unreadCount && room.unreadCount > 0 && (
                    <span className="unread-badge">{room.unreadCount}</span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}

        {currentApp === 'drawing' && (
          <>
            <div className="sidebar-header">
              <span className="sidebar-title">Canvases</span>
              <button
                className="join-room-button"
                onClick={() => setShowJoinCanvasDialog(true)}
                title="Join/Create Canvas"
              >
                +
              </button>
            </div>

            <div className="room-list">
              {canvases.map((canvas) => (
                <button
                  key={canvas.id}
                  className={`room-item ${currentCanvas === canvas.id ? 'active' : ''}`}
                  onClick={() => onCanvasChange(canvas.id)}
                >
                  <span className="room-name">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{marginRight: '6px', verticalAlign: 'middle'}}>
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                      <path d="M3 9h18" strokeWidth="2"/>
                      <path d="M9 21V9" strokeWidth="2"/>
                    </svg>
                    {canvas.name}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {showJoinDialog && (
        <div className="modal-overlay" onClick={() => setShowJoinDialog(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Join/Create Room</h3>
            <input
              type="text"
              placeholder="Enter room ID..."
              value={newRoomId}
              onChange={(e) => setNewRoomId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
              autoFocus
            />
            <div className="modal-buttons">
              <button onClick={() => setShowJoinDialog(false)}>Cancel</button>
              <button onClick={handleJoinRoom} disabled={!newRoomId.trim()}>
                Join
              </button>
            </div>
          </div>
        </div>
      )}

      {showJoinCanvasDialog && (
        <div className="modal-overlay" onClick={() => setShowJoinCanvasDialog(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Join/Create Canvas</h3>
            <input
              type="text"
              placeholder="Enter canvas ID..."
              value={newCanvasId}
              onChange={(e) => setNewCanvasId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoinCanvas()}
              autoFocus
            />
            <div className="modal-buttons">
              <button onClick={() => setShowJoinCanvasDialog(false)}>Cancel</button>
              <button onClick={handleJoinCanvas} disabled={!newCanvasId.trim()}>
                Join
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
