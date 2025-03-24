import express from "express";
import { WebSocketServer } from "ws";
import { createServer } from "http";
// import cors from "cors";
// "cors": "^2.8.5",
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });


// app.use(cors({
//   origin: "*", 
//   methods: ["GET", "POST"], 
//   credentials: true 
// }));

app.use(express.static("public"));

app.get('/ping', (req, res) => {
  console.log('Ping received:', req.method, req.url);
  res.status(200).json({ message: 'Ping received' });
});

let connectetUsers = 0;

wss.on("connection", (ws) => {
  console.log("New client connected!");
  connectetUsers++;

  ws.on("message", (message) => {
  console.log(`Received: ${message}`);
  
  try {
    let parsedMessage = JSON.parse(message); 
    parsedMessage.online = connectetUsers; 
    console.log(parsedMessage.online);

    const updatedMessage = JSON.stringify(parsedMessage); 


    wss.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
            client.send(updatedMessage);
        }
    });

  } catch (error) {
    console.error("Error parsing message:", error);
  }
});

  ws.on("close", () => {
    console.log("Client disconnected");
    connectetUsers--;
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Running on port: ${PORT}`);
});
