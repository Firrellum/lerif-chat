const socketProtocol = window.location.protocol === "https:" ? "wss" : "ws";
const socket = new WebSocket(`${socketProtocol}://${window.location.host}`);

socket.onmessage = (event) => {
  const onlines = document.getElementById('online-peepo');
  const message = JSON.parse(event.data);
  const chatBox = document.getElementById("chatBox");
  chatBox.innerHTML += `<p><strong>${message.username}:</strong> ${message.text}</p>`;
  onlines.innerHTML = `<p><strong>${message.online}</strong> Onilne`;
  chatBox.scrollTop = chatBox.scrollHeight;
};

socket.onerror = (error) => {
  console.log(`WebSocket Error: ${error}`);
};

socket.onopen = () => {
  console.log("WebSocket connection established");
};

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem('lerrif-username')){
    document.getElementById("login-container").style.display = "none";
    document.getElementById("chat-container").style.display = "flex";
  }
})


document.getElementById("enterButton").addEventListener("click", () => {
  const usernameInput = document.getElementById("usernameInput");
  const username = usernameInput.value.trim();

  if (username) {
    localStorage.setItem("lerrif-username", username);
    document.getElementById("login-container").style.display = "none";
    document.getElementById("chat-container").style.display = "flex";
  } else {
    alert("Please enter a valid username!");
  }
});


document.getElementById("messageForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const messageInput = document.getElementById("messageInput");
  const username = localStorage.getItem("lerrif-username");

  if (messageInput.value.trim()) {
    const message = {
        username: username,
        text: messageInput.value.trim(),
        online: null
  };

  socket.send(JSON.stringify(message));
    messageInput.value = "";
  }

});

async function pingServer() {
  const pingDisplay = document.getElementById('ping');
  try {
    const res = await fetch(`/ping`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });
    const data = await res.json();
    console.log('Ping response:', data);
    pingDisplay.textContent = '🟢 Connected';
  } catch (error) {
    console.error('Error pinging server:', error);
  }
}



pingServer();