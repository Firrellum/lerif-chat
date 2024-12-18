const ws = new WebSocket(`ws://${window.location.host}`);
let username = '';

function setUsername() {
  const usernameInput = document.getElementById('username');
  const enteredName = usernameInput.value.trim();

  if (enteredName) {
    username = enteredName;
    document.getElementById('usernameForm').style.display = 'none'; 
    document.getElementById('chatApp').style.display = 'flex'; 
  } else {
    alert('Please enter a valid username.'); 
  }
}

ws.onmessage = (event) => {
  const messages = document.getElementById('messages');
  const messageData = JSON.parse(event.data);

  const messageDiv = document.createElement('div');
  messageDiv.textContent = `${messageData.username}: ${messageData.message}`;
  messages.appendChild(messageDiv);
  messages.scrollTop = messages.scrollHeight;
};

function sendMessage() {
  const input = document.getElementById('message');
  const messageText = input.value.trim();

  if (messageText) {
    const messageData = {
      username: username,
      message: messageText,
    };

    ws.send(JSON.stringify(messageData)); 
    input.value = '';
  }
}
