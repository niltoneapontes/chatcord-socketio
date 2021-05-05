const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and Room from URL
const { avatar, username, room } = Qs.parse(window.location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chat room
socket.emit('joinRoom', {
  avatar,
  username,
  room
});

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
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
    <img src="../assets/${message.avatar}.svg" width="32px" alt="Avatar">
    <p class="meta"> ${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>
  `;
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM

function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `
      <li><img src="../assets/${user.avatar}.svg" alt="Avatar"><p>${user.username}</p></li>
    `).join('')}
  `;
}
