const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

wss.on('connection', (ws) => {
  console.log('New client connected!');

  ws.on('message', (message) => {
    console.log(`Received: ${message}`);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Running on port: ${PORT}`);
});
