const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// Use a Map to store users, with socket.id as key and username as value
const connectedUsers = new Map();

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`🔌 A user connected with socket ID: ${socket.id}`);

  // New event for when a user joins with a username
  socket.on('join-server', (username) => {
    connectedUsers.set(socket.id, username);
    io.emit('update-user-list', Array.from(connectedUsers.entries()));
  });

  socket.on('start-drawing', (data) => {
    socket.broadcast.emit('start-drawing', data);
  });

  socket.on('drawing', (data) => {
    socket.broadcast.emit('drawing', data);
  });

  socket.on('finish-drawing', () => {
    socket.broadcast.emit('finish-drawing');
  });

  socket.on('clear-canvas', () => {
    socket.broadcast.emit('clear-canvas');
  });

  socket.on('disconnect', () => {
    console.log(`🔌 A user disconnected with socket ID: ${socket.id}`);
    connectedUsers.delete(socket.id);
    io.emit('update-user-list', Array.from(connectedUsers.entries()));
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});