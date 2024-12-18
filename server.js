const express = require("express");
const { WebSocketServer } = require("ws");
const WebSocket = require("ws"); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

const server = app.listen(PORT, () => {
  console.log(`running on port: ${PORT}`);
});


const socketProtocol = (process.env.NODE_ENV === 'production') ? 'wss' : 'ws';
const wss = new WebSocket(`${socketProtocol}://${window.location.host}`);


wss.on("connection", (ws) => {
  console.log("New client connected!");

  ws.on("message", (message) => {
    const messageData = JSON.parse(message);

    console.log(`Received message from ${messageData.username}: ${messageData.message}`);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(messageData)); 
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected.");
  });
});

