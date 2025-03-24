import express from "express";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import cors from "cors";

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(express.static("public"));

app.get('/ping', (req, res) => {
    console.log('Ping received:', req.method, req.url);
    // Explicitly set CORS headers (redundant with cors middleware, but ensures it works)
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Credentials', 'true');
    res.status(200).json({ message: 'Ping received' });
});

let connectetUsers = 0;

// Handle WebSocket handshake and add CORS headers
server.on('upgrade', (request, socket, head) => {
  const origin = request.headers.origin;
  console.log('WebSocket handshake request from origin:', origin);

  // Allow all origins for development; in production, restrict to your portfolio's domain
  const allowedOrigins = ["*"]; // Replace with ["https://your-portfolio.com"] in production
  if (true && !allowedOrigins.includes(origin)) {
      console.log(`WebSocket handshake rejected from unauthorized origin: ${origin}`);
      socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
      socket.destroy();
      return;
  }

  // Add CORS headers to the handshake response
  wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
  });
});

wss.on("connection", (ws, req) => {
    const origin = req.headers.origin;
    console.log("New client connected! Origin:", origin);

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