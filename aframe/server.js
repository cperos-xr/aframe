const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const dotenv = require('dotenv').config();
const { interactWithInworldAI } = require('./inworldAI');

const app = express();
const server = http.createServer(app); // HTTP server from Express app
const wss = new WebSocket.Server({ server }); // Attach WebSocket server to the same HTTP server



// WebSocket connection handler
wss.on('connection', function connection(ws) {
  // Inside WebSocket 'connection' event handler
  ws.on('message', function incoming(buffer) {
    const message = buffer.toString(); // Convert buffer to string
    console.log('Received message from client:', message);
    interactWithInworldAI(message, ws);
  });



  // Error event handler
  ws.on('error', function error(error) {
      console.error('WebSocket error:', error);
  });

  // Close event handler
  ws.on('close', function close() {
      console.log('WebSocket connection closed');
  });

  // Send a welcome message to the client
  ws.send(JSON.stringify({ message: 'Welcome to the WebSocket server!' }));
});

// Serve static files from the project root
app.use(express.static(path.join(__dirname)));
app.use(express.json());
//app.use(express.static(path.join(__dirname, 'dist'))); // for distribution

app.get('/api/config', (req, res) => {
  res.json({ 
    SPEECH_KEY: process.env.SPEECH_KEY,
    CONVAI_API_KEY: process.env.CONVAI_API_KEY,
    INWORLD_KEY: process.env.INWORLD_KEY,       // Expose INWORLD_KEY
    INWORLD_SECRET: process.env.INWORLD_SECRET, // Expose INWORLD_SECRET
    INWORLD_SCENE: process.env.INWORLD_SCENE    // Expose INWORLD_SCENE
  });
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

