const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Enable CORS for all origins (you can restrict this later)
app.use(cors());

// Configure Socket.IO with CORS
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins (restrict to your Cloudflare Pages URL in production)
    methods: ["GET", "POST"]
  }
});

// Serve static files (optional - mainly for local testing)
app.use(express.static('public'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', games: games.size });
});

// Store active games in memory
const games = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Create new game
  socket.on('createGame', (data) => {
    const { roomCode, gameData } = data;
    // Deep clone to prevent reference issues
    const clonedGame = JSON.parse(JSON.stringify(gameData));
    games.set(roomCode, clonedGame);
    socket.join(roomCode);
    socket.emit('gameCreated', { roomCode, gameData: clonedGame });
    console.log(`Game created: ${roomCode}`);
    console.log(`Players:`, clonedGame.players.map(p => ({ name: p.name, rack: p.rack })));
  });

  // Join existing game
  socket.on('joinGame', (data) => {
    const { roomCode, playerData } = data;
    const game = games.get(roomCode);
    
    if (!game) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }

    if (game.players.length >= game.maxPlayers) {
      socket.emit('error', { message: 'Game is full' });
      return;
    }

    // Deep clone player data to prevent reference issues
    const clonedPlayer = JSON.parse(JSON.stringify(playerData));
    game.players.push(clonedPlayer);
    const clonedGame = JSON.parse(JSON.stringify(game));
    games.set(roomCode, clonedGame);
    socket.join(roomCode);
    
    // Notify all players in room
    io.to(roomCode).emit('gameUpdate', clonedGame);
    console.log(`Player joined: ${roomCode}`);
  });

  // Update game state
  socket.on('updateGame', (data) => {
    const { roomCode, gameData } = data;
    // Deep clone to prevent reference issues
    const clonedGame = JSON.parse(JSON.stringify(gameData));
    games.set(roomCode, clonedGame);
    
    // Broadcast to all players in room
    io.to(roomCode).emit('gameUpdate', clonedGame);
  });

  // Get game state
  socket.on('getGame', (roomCode) => {
    const game = games.get(roomCode);
    if (game) {
      socket.emit('gameUpdate', game);
    } else {
      socket.emit('error', { message: 'Game not found' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access locally at: http://localhost:${PORT}`);
});