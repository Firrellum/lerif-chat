import express from "express";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import cors from "cors";

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors({
    origin: "https://firrelsoftware.onrender.com", 
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(express.static("public"));

app.get('/ping', (req, res) => {
    console.log('Ping received:', req.method, req.url);
    res.set('Access-Control-Allow-Origin', 'https://firrelsoftware.onrender.com');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Credentials', 'true');
    res.status(200).json({ message: 'Ping received' });
});

let connectetUsers = 0;
server.on('upgrade', (request, socket, head) => {
    const origin = request.headers.origin;
    console.log('WebSocket handshake request from origin:', origin);

    const allowedOrigins = ["https://firrelsoftware.onrender.com"];
    const isWildcard = allowedOrigins.length === 1 && allowedOrigins[0] === "*";
    if (!isWildcard && !allowedOrigins.includes(origin)) {
        console.log(`WebSocket handshake rejected from unauthorized origin: ${origin}`);
        socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
        socket.destroy();
        return;
    }

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
            console.log(`Online users: ${parsedMessage.online}`);

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

    ws.on("close", (code, reason) => {
        console.log(`Client disconnected. Code: ${code}, Reason: ${reason}`);
        connectetUsers--;
    });

    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Running on port: ${PORT}`);
});