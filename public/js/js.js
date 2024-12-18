// Check if the page is served over HTTPS (for production) or HTTP (for local dev)
const socketProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

// Establish the WebSocket connection using the appropriate protocol
const socket = new WebSocket(`${socketProtocol}://${window.location.host}`);

// Function to handle WebSocket messages
socket.onmessage = function(event) {
  const message = event.data;
  console.log(`Message from server: ${message}`);

  // Insert the message into the chat window (you can customize this)
  const chatBox = document.getElementById('chatBox');
  chatBox.innerHTML += `<p>${message}</p>`;
};

// Handle WebSocket errors
socket.onerror = function(error) {
  console.log(`WebSocket Error: ${error}`);
};

// Handle WebSocket open event (when the connection is established)
socket.onopen = function() {
  console.log('WebSocket connection established');
};

// Send a message when the form is submitted
document.getElementById('messageForm').onsubmit = function(event) {
  event.preventDefault();

  const messageInput = document.getElementById('messageInput');
  const usernameInput = document.getElementById('usernameInput');
  const message = {
    username: usernameInput.value,
    text: messageInput.value,
  };

  // Send the message as JSON
  socket.send(JSON.stringify(message));

  // Clear the input field after sending the message
  messageInput.value = '';
};
