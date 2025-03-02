// WebSocket connection setup
const socketProtocol = window.location.protocol === "https:" ? "wss" : "ws";
const socket = new WebSocket(`${socketProtocol}://${window.location.host}`);

socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    const chatBox = document.getElementById("chatBox");
    chatBox.innerHTML += `<p><strong>${message.username}:</strong> ${message.text}</p>`;
};

socket.onerror = (error) => {
    console.log(`WebSocket Error: ${error}`);
};

socket.onopen = () => {
    console.log("WebSocket connection established");
};

// Handle entering the chat
document.getElementById("enterButton").addEventListener("click", () => {
    const usernameInput = document.getElementById("usernameInput");
    const username = usernameInput.value.trim();
    
    if (username) {
        localStorage.setItem("username", username);

        // Show chat container and hide login
        document.getElementById("login-container").style.display = "none";
        document.getElementById("chat-container").style.display = "flex";
    } else {
        alert("Please enter a valid username!");
    }
});

// Handle sending messages
document.getElementById("messageForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const messageInput = document.getElementById("messageInput");
    const username = localStorage.getItem("username");

    if (messageInput.value.trim()) {
        const message = {
            username: username,
            text: messageInput.value.trim(),
        };
        socket.send(JSON.stringify(message));
        messageInput.value = "";
    }
});
