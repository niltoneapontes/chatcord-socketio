// This is the backend!

const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeavesChat, getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder for ~static content

app.use(express.static(path.join(__dirname, 'public')));

// Run when client connects
io.on('connection', socket => {

  // Joining room
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcoming user
    socket.emit('message', formatMessage('Chatcord bot', 'Welcome to chatcord'));

    // Broadcast when a user connects to everyone but them
    socket.broadcast.to(user.room).emit('message', formatMessage('Chatcord bot', `${user.username} has joined the chat`));

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Broadcasting to ALL users
  // io.emit('...')

  // Getting message
  socket.on('chatMessage', message => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, message));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeavesChat(socket.id);

    if(user) {
      io.to(user.room).emit('message', formatMessage('Chatcord bot', `${user.username} has left the chat`));

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Servidor rodando na porta: ${PORT} 🌈`));