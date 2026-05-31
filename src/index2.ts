import { WebSocketServer, WebSocket } from 'ws';

//! Create a WebSocket server on port 8001
const wss = new WebSocketServer({ port: 8001 });

interface User {
  socket: WebSocket;
  room: string;
}

let allSockets: User[] = [];
// ! Listen for new client connections
wss.on('connection', (socket: WebSocket) => {
  socket.on('message', (message: string) => {
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.type === 'join') {
      console.log(`User joined room: ${parsedMessage.payload.roomId}`);
      console.log(`User socket: ${socket}`);
      allSockets.push({ socket, room: parsedMessage.payload.roomId });
    }
    if (parsedMessage.type === 'chat') {
      console.log(`Received message: ${parsedMessage.payload.message}`);

      // Find the room of the current user
      let currentUserRoom = null;
      for (let i = 0; i < allSockets.length; i++) {
        const user = allSockets[i];
        if (user && user.socket === socket) {
          currentUserRoom = user.room;
          break;
        }
      }
      //! Broadcast the message to all clients in the same room
      for (let i = 0; i < allSockets.length; i++) {
        const user = allSockets[i];
        if (user && user.room === currentUserRoom) {
          user.socket.send(parsedMessage.payload.message);
        }
      }
    }
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
  socket.on('error', (error) => {
    console.error(`WebSocket error: ${error}`);
  });
});

console.log('WebSocket server is running on ws://localhost:8001');
