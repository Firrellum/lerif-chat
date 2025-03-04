// gets protocal form current page
// if page is using https, webSocket Secure is set else webSosket is used 
const socketProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

// creating a new websocket connection
// uses wss or ws based on the condition above
const socket = new WebSocket(`${socketProtocol}://${window.location.host}`);

// assign functoin that is called when a message comes from server
socket.onmessage = (event) => {
  // elements where online count and chats are displayed
  const onlines = document.getElementById('online-peepo');
  const chatBox = document.getElementById('chatBox');
  
  // store for the incoming message
  // raw parsed form json to object 
  const message = JSON.parse(event.data);
  
  // ui updates to chatbox and online count
  chatBox.innerHTML += `<p><strong>${message.username}:</strong> ${message.text}</p>`;
  onlines.innerHTML = `<p><strong>${message.online}</strong> Onilne`;
  
  // auto scroll chat box to bottom
  chatBox.scrollTop = chatBox.scrollHeight;
};

// function that is triggered on error to log a message
socket.onerror = (error) => {
  console.log(`WebSocket Error: ${error}`);
};

// function that triggers on success connect and logs message
socket.onopen = () => {
  console.log('WebSocket connection established');
};

// funciton that is triggered once dom has loaded
document.addEventListener('DOMContentLoaded', () => {
  // checks local store to see if a username has been saved
  if (localStorage.getItem('lerrif-username')){
    // hides login and displays chatroom
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('chat-container').style.display = 'flex';
  }
})

// event listener for the username entry
document.getElementById('enterButton').addEventListener('click', () => {
  // stores and trims the value of the username input field 
  const usernameInput = document.getElementById('usernameInput');
  const username = usernameInput.value.trim();

  // if there is a username
  if (username) {
    // store username to LS
    localStorage.setItem('lerrif-username', username);
    // hide login and displays chatbox
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('chat-container').style.display = 'flex';
  } else {
    // no username throws an alert
    alert('Please enter a valid username!');
  }
});

// listerner that is triggered on chat input
document.getElementById('messageForm').addEventListener('submit', (event) => {
  event.preventDefault();
  // text is stored from the input element, username from LS
  const messageInput = document.getElementById('messageInput');
  const username = localStorage.getItem('lerrif-username');

  // checks to see if a message exists
  if (messageInput.value.trim()) {
    // mesage opject is created
    const message = {
        username: username,
        text: messageInput.value.trim(),
        online: null
  };

  // message sent to server and input field cleared
  socket.send(JSON.stringify(message));
    messageInput.value = '';
  }

});

// funciton that pings the server (to tell if render is still spinning up)
async function pingServer() {
  const pingDisplay = document.getElementById('ping');
  try {
    const res = await fetch(`/ping`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
    const data = await res.json();
    console.log('Ping response:', data);
    pingDisplay.textContent = '🟢 Connected';
  } catch (error) {
    console.error('Error pinging server:', error);
  }
}

// call server ping
pingServer();