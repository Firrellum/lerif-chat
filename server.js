// Import the necessary modules
const express = require('express');
const WebSocket = require('ws');
const http = require('http');

// Create an Express app
const app = express();

// Create a server using http
const server = http.createServer(app);

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

// Serve static files (e.g., your HTML, CSS, JS) from the 'public' directory
app.use(express.static('public'));

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('New client connected!');

  // Handle incoming messages from clients
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);

    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  // Handle WebSocket connection close
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Listen on a port (use process.env.PORT for production or 3000 for local dev)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Running on port: ${PORT}`);
});
