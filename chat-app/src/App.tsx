import { useEffect, useRef, useState } from 'react';

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isRoomJoined, setIsRoomJoined] = useState(false);

  const websocketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto Scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // WebSocket Connection
  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8001');

    websocketRef.current = websocket;

    websocket.onopen = () => {
      console.log('Connected to WebSocket Server');
      setIsConnected(true);
    };

    websocket.onclose = () => {
      console.log('Disconnected from WebSocket Server');
      setIsConnected(false);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    websocket.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    return () => {
      websocket.close();
    };
  }, []);

  // Send Message
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    if (!isRoomJoined) {
      alert('Please join a room first!');
      return;
    }

    const websocket = websocketRef.current;

    if (!websocket || websocket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return;
    }

    websocket.send(
      JSON.stringify({
        type: 'chat',
        payload: {
          message: inputMessage,
        },
      }),
    );

    setInputMessage('');
  };

  // Join Room
  const handleJoinRoom = () => {
    if (!roomId.trim()) return;

    const websocket = websocketRef.current;

    if (!websocket || websocket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return;
    }

    websocket.send(
      JSON.stringify({
        type: 'join',
        payload: {
          roomId: roomId,
        },
      }),
    );

    setIsRoomJoined(true);
    setMessages((prev) => [...prev, `✅ Joined Room: ${roomId}`]);

    setRoomId('');
  };

  // Enter Key Support
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-5xl h-[95vh] bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-950">
          <div>
            <h1 className="text-3xl font-bold text-white">WebSocket Chat</h1>

            <p className="text-zinc-400 text-sm mt-1">
              Real-time Messaging App
            </p>
          </div>

          <div
            className={`px-4 py-2 rounded-full text-sm font-semibold border ${
              isConnected
                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}
          >
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        {/* Join Room Section */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-900">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter Room ID..."
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="
                flex-1
                bg-zinc-800
                border
                border-zinc-700
                text-white
                placeholder:text-zinc-500
                px-5
                py-3
                rounded-2xl
                outline-none
                focus:ring-2
                focus:ring-green-500
                transition-all
              "
            />

            <button
              onClick={handleJoinRoom}
              className="
                bg-green-600
                hover:bg-green-500
                text-white
                px-6
                py-3
                rounded-2xl
                font-semibold
                transition-all
                duration-300
                hover:scale-105
                active:scale-95
              "
            >
              Join Room
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 bg-zinc-900">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-zinc-300">
                  No Messages Yet
                </h2>

                <p className="text-zinc-500 mt-2">
                  Join a room and start chatting 🚀
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className="flex">
                <div
                  className="
                    max-w-[75%]
                    bg-blue-600
                    text-white
                    px-5
                    py-3
                    rounded-2xl
                    rounded-bl-md
                    shadow-lg
                    break-words
                    text-sm
                    sm:text-base
                  "
                >
                  {message}
                </div>
              </div>
            ))
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="
                flex-1
                bg-zinc-800
                border
                border-zinc-700
                text-white
                placeholder:text-zinc-500
                px-5
                py-4
                rounded-2xl
                outline-none
                focus:ring-2
                focus:ring-blue-500
                transition-all
              "
            />

            <button
              onClick={handleSendMessage}
              className="
                bg-blue-600
                hover:bg-blue-500
                text-white
                px-8
                py-4
                rounded-2xl
                font-semibold
                transition-all
                duration-300
                hover:scale-105
                active:scale-95
              "
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
