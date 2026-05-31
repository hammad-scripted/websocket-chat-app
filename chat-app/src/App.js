import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { useState } from 'react';
function App() {
    const [messages, setMessages] = useState([
        'Hi there!',
        'How are you?',
        'This is a WebSocket chat app built with React and TypeScript.',
    ]);
    const websocketRef = useRef(null);
    useEffect(() => {
        const websocket = new WebSocket('ws://localhost:8001');
        websocketRef.current = websocket;
        websocket.onopen = () => {
            console.log('WebSocket connection established');
            websocket.send(JSON.stringify({ type: 'join', payload: { roomId: 'red' } }));
        };
        websocket.onmessage = (event) => {
            console.log('Received message:', event.data);
            setMessages((prevMessages) => [...prevMessages, event.data]);
        };
    }, []);
    const handleSendMessage = () => {
        // Implement the logic to send a message through the WebSocket connection
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value;
        messageInput.value = '';
        const websocket = websocketRef.current;
        if (!websocket) {
            console.error('WebSocket connection not established');
            return;
        }
        websocket.send(JSON.stringify({
            type: 'chat',
            payload: {
                message: message,
            },
        }));
    };
    const handleJoinRoom = () => {
        const websocket = websocketRef.current;
        websocket.send(JSON.stringify({
            type: 'join',
            payload: {
                roomId: "123"
            }
        }));
    };
    return (_jsxs("div", { className: "min-h-screen flex flex-col justify-between items-center bg-gray-900", children: [_jsx("div", { className: "h-[80vh] w-full m-2 p-4 overflow-y-scroll flex flex-col gap-4", children: messages.map((message, index) => {
                    return (_jsx("p", { className: "text-white mb-2 p-2 bg-gray-800 rounded-lg w-fit\r\n              transition duration-300 ease-in-out hover:bg-gray-700 cursor-pointer", children: message }, index));
                }) }), _jsxs("div", { className: "  flex flex-row items-center justify-center", children: [_jsx("input", { id: "messageInput", type: "text", placeholder: "Type a message...", className: "\r\n    w-full\r\n    bg-gray-800\r\n    text-gray-300\r\n    placeholder:text-gray-500\r\n    border\r\n    border-gray-600\r\n    rounded-lg\r\n    p-4\r\n    pl-4\r\n    pr-12\r\n    m-2\r\n    mb-6\r\n    \r\n    transition\r\n    duration-300\r\n    ease-in-out\r\n    focus:outline-none\r\n    focus:ring-2\r\n    focus:ring-blue-500\r\n    focus:border-blue-500\r\n  " }), _jsxs("button", { className: "mb-4 mr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded *:transition *:duration-300 *:ease-in-out ", onClick: handleJoinRoom, children: ["Join Room", ' '] }), _jsx("button", { className: "mb-4 mr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded *:transition *:duration-300 *:ease-in-out \r\n        \r\n        ", onClick: handleSendMessage, children: "Send" })] })] }));
}
export default App;
//# sourceMappingURL=App.js.map