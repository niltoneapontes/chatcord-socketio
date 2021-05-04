const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

// Get username and Room from URL
const { username, room } = Qs.parse(window.location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chat room
socket.emit('joinRoom', {
  username,
  room
})

// Message from server
socket.on('message', message => {
  outputMessage(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Message submit

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const message = event.target.elements.msg.value;

  // Emitting a message to server
  socket.emit('chatMessage', message);

  event.target.elements.msg.value = '';
  event.target.elements.msg.focus();
})

// Function that outputs message to DOM

function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `
    <p class="meta"> ${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>
  `;
  document.querySelector('.chat-messages').appendChild(div);
}