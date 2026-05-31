import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
let userCount = 0;
wss.on('connection', (ws) => {
  userCount++;
  console.log(`New client connected. Total clients: ${userCount}`);

  // listen for this client to send messages
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    // broadcast the message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(message);
      }
    });
  });

  // listen for this client to disconnect
  ws.on('close', () => {
    userCount--;
    console.log(`Client disconnected. Total clients: ${userCount}`);
  });
});
wss.on('error', (error) => {
  console.error(`WebSocket server error: ${error}`);
});

console.log('WebSocket server is running on ws://localhost:8080');
