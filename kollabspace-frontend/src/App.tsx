import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import { chatService } from './services/chatService';
import type { AppType, ChatRoom, ChatMessage } from './types/chat';
import './App.css';

function App() {
  const [currentApp, setCurrentApp] = useState<AppType>('chat');
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [userName, setUserName] = useState('');
  const [showUserNameDialog, setShowUserNameDialog] = useState(true);

  useEffect(() => {
    // Connect to WebSocket
    const connect = async () => {
      try {
        await chatService.connect(
          () => {
            setIsConnected(true);
            console.log('WebSocket connected');
          },
          (error) => {
            setIsConnected(false);
            console.error('WebSocket error:', error);
          }
        );
      } catch (error) {
        console.error('Failed to connect:', error);
      }
    };

    connect();

    return () => {
      chatService.disconnect();
    };
  }, []);

  useEffect(() => {
    if (currentRoom && isConnected) {
      // Fetch chat history
      chatService.fetchChatHistory(currentRoom).then((history) => {
        setMessages(history);
      });

      // Subscribe to room
      chatService.subscribeToRoom(currentRoom, (message) => {
        setMessages((prev) => [...prev, message]);
      });

      return () => {
        chatService.unsubscribeFromRoom(currentRoom);
      };
    }
  }, [currentRoom, isConnected]);

  const handleJoinRoom = (roomId: string) => {
    // Check if room already exists
    const existingRoom = rooms.find((r) => r.id === roomId);
    if (!existingRoom) {
      const newRoom: ChatRoom = {
        id: roomId,
        name: roomId,
      };
      setRooms((prev) => [...prev, newRoom]);
    }
    setCurrentRoom(roomId);
  };

  const handleRoomChange = (roomId: string) => {
    setCurrentRoom(roomId);
    setMessages([]);
  };

  const handleSendMessage = (text: string) => {
    if (currentRoom && userName) {
      chatService.sendMessage(currentRoom, {
        userName,
        text,
      });
    }
  };

  const handleSetUserName = (name: string) => {
    if (name.trim()) {
      setUserName(name.trim());
      setShowUserNameDialog(false);
    }
  };

  return (
    <>
      {showUserNameDialog && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Welcome to KollabSpace</h2>
            <p>Enter your username to start chatting</p>
            <input
              type="text"
              placeholder="Your username..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSetUserName(e.currentTarget.value);
                }
              }}
              autoFocus
            />
            <button
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                handleSetUserName(input.value);
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      <div className="app">
        <Sidebar
          currentApp={currentApp}
          onAppChange={setCurrentApp}
          rooms={rooms}
          currentRoom={currentRoom}
          onRoomChange={handleRoomChange}
          onJoinRoom={handleJoinRoom}
        />

        <div className="app-content">
          {currentApp === 'chat' && currentRoom ? (
            <Chat
              roomId={currentRoom}
              userName={userName}
              messages={messages}
              onSendMessage={handleSendMessage}
              isConnected={isConnected}
            />
          ) : currentApp === 'chat' ? (
            <div className="empty-view">
              <h2>Welcome to KollabSpace Chat</h2>
              <p>Select a room or join a new one to start chatting</p>
            </div>
          ) : (
            <div className="empty-view">
              <h2>Docs</h2>
              <p>Documentation feature coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
