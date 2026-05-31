import { useEffect, useRef, useState } from 'react';

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const websocketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8001');

    websocketRef.current = websocket;

    websocket.onopen = () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
    };

    websocket.onclose = () => {
      console.log('Disconnected from WebSocket server');
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

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

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

  const handleJoinRoom = () => {
    const websocket = websocketRef.current;

    if (!websocket || websocket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return;
    }

    websocket.send(
      JSON.stringify({
        type: 'join',
        payload: {
          roomId: 'green',
        },
      }),
    );

    setMessages((prev) => [
      ...prev,
      '✅ You joined room: green',
    ]);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[92vh] bg-gray-900/80 backdrop-blur-lg border border-gray-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-950/60">
          <div>
            <h1 className="text-2xl font-bold text-white">
              WebSocket Chat
            </h1>
            <p className="text-sm text-gray-400">
              Real-time messaging app
            </p>
          </div>

          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isConnected
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}
          >
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-xl text-gray-300 font-semibold">
                  No Messages Yet
                </h2>
                <p className="text-gray-500 mt-2">
                  Join a room and start chatting 🚀
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className="flex items-start"
              >
                <div className="max-w-[80%] bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-3 rounded-2xl rounded-tl-sm shadow-lg break-words hover:scale-[1.01] transition-all duration-300">
                  {message}
                </div>
              </div>
            ))
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <div className="border-t border-gray-800 bg-gray-950/50 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            
            <input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) =>
                setInputMessage(e.target.value)
              }
              onKeyDown={handleKeyDown}
              className="
                flex-1
                bg-gray-800/80
                border border-gray-700
                text-white
                placeholder:text-gray-500
                px-5
                py-4
                rounded-2xl
                outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:border-blue-500
                transition-all
                duration-300
              "
            />

            <div className="flex gap-3">
              <button
                onClick={handleJoinRoom}
                className="
                  px-5
                  py-3
                  rounded-2xl
                  bg-gray-800
                  hover:bg-gray-700
                  text-white
                  font-semibold
                  transition-all
                  duration-300
                  hover:scale-105
                  active:scale-95
                "
              >
                Join
              </button>

              <button
                onClick={handleSendMessage}
                className="
                  px-6
                  py-3
                  rounded-2xl
                  bg-gradient-to-r
                  from-blue-600
                  to-blue-500
                  hover:from-blue-500
                  hover:to-blue-400
                  text-white
                  font-semibold
                  shadow-lg
                  transition-all
                  duration-300
                  hover:scale-105
                  active:scale-95
                "
              >
                Send 🚀
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;