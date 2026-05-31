import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
let userCount = 0;
wss.on('connection', (ws) => {
  userCount++;
  console.log(`New client connected. Total clients: ${userCount}`);
  console.log(
    `Message sent by User: ${userCount} WebSocket connection established.`,
  );

  // // listen for this client to send messages
  // ws.on('message', (message) => {
  //   console.log(`Received message: ${message}`);
  //   // broadcast the message to all connected clients
  //   wss.clients.forEach((client) => {
  //     if (client.readyState === client.OPEN) {
  //       client.send(message);
  //     }
  //   });
  // });

  //* listen for the client to send messages and broadcast them to all connected clients
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);

    wss.clients.forEach((client) => {
      // check if the connection is open or is it closed
      if (client.readyState === client.OPEN) {
        setTimeout(() => {
          client.send(`Echo: ${message.toString() + ' send by server'}`);
        }, 1000);
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
