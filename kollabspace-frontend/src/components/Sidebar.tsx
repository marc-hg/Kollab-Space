import { useState } from 'react';
import type {AppType, ChatRoom} from '../types/chat';
import './Sidebar.css';

interface SidebarProps {
  currentApp: AppType;
  onAppChange: (app: AppType) => void;
  rooms: ChatRoom[];
  currentRoom: string | null;
  onRoomChange: (roomId: string) => void;
  onJoinRoom: (roomId: string) => void;
}

export default function Sidebar({
  currentApp,
  onAppChange,
  rooms,
  currentRoom,
  onRoomChange,
  onJoinRoom,
}: SidebarProps) {
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [newRoomId, setNewRoomId] = useState('');

  const handleJoinRoom = () => {
    if (newRoomId.trim()) {
      onJoinRoom(newRoomId.trim());
      setNewRoomId('');
      setShowJoinDialog(false);
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
                title="Join Room"
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
      </div>

      {showJoinDialog && (
        <div className="modal-overlay" onClick={() => setShowJoinDialog(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Join Room</h3>
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
    </div>
  );
}
