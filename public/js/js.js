const socketProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

const socket = new WebSocket(`${socketProtocol}://${window.location.host}`);

socket.onmessage = function(event) {
  const message = event.data;
  console.log(`Message from server: ${message}`);

  const chatBox = document.getElementById('chatBox');
  chatBox.innerHTML += `<p>${message}</p>`;
};

socket.onerror = function(error) {
  console.log(`WebSocket Error: ${error}`);
};

socket.onopen = function() {
  console.log('WebSocket connection established');
};

document.getElementById('messageForm').onsubmit = function(event) {
  event.preventDefault();

  const messageInput = document.getElementById('messageInput');
  const usernameInput = document.getElementById('usernameInput');
  const message = {
    username: usernameInput.value,
    text: messageInput.value,
  };

  socket.send(JSON.stringify(message));

  messageInput.value = '';
};
