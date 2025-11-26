import {useState, useEffect, useRef} from 'react';
import type {ChatMessage} from '../types/chat';
import './Chat.css';

interface ChatProps {
    roomId: string;
    userName: string;
    messages: ChatMessage[];
    onSendMessage: (text: string) => void;
    isConnected: boolean;
}

export default function Chat({
                                 roomId,
                                 userName,
                                 messages,
                                 onSendMessage,
                                 isConnected,
                             }: ChatProps) {
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (inputText.trim() && isConnected) {
            onSendMessage(inputText.trim());
            setInputText('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <div className="chat-header-info">
                    <h2># {roomId}</h2>
                    <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
                </div>
            </div>

            <div className="chat-messages">
                {messages.length === 0 ? (
                    <div className="empty-state">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={`message ${message.userName === userName ? 'own-message' : ''}`}
                        >
                            <div className="message-header">
                                <span className="message-author">{message.userName}</span>
                                <span className="message-time">{formatTime(message.timestamp)}</span>
                            </div>
                            <div className="message-text">{message.text}</div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef}/>
            </div>

            <div className="chat-input-container">
                <div className="chat-input-wrapper">
                    <input
                        type="text"
                        className="chat-input"
                        placeholder={
                            isConnected
                                ? `Message # ${roomId}`
                                : 'Connecting...'
                        }
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyPress}
                        disabled={!isConnected}
                    />
                    <button
                        className="send-button"
                        onClick={handleSendMessage}
                        disabled={!inputText.trim() || !isConnected}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
