const express = require('express');
const path = require('path');
const dotenv = require('dotenv').config();

const { interactWithInworldAI } = require('./inworldAI');

const app = express();

const http = require('http');
const WebSocket = require('ws');

const server = http.createServer();
const wss = new WebSocket.Server({ server });
// WebSocket connection handler
wss.on('connection', function connection(ws) {
  console.log("WebSocket client connected");

  ws.on('message', async function incoming(buffer) {
    const message = buffer.toString();
    console.log('Received message from client:', message);
    interactWithInworldAI(message, ws);
/*
    try {
      const aiResponse = await interactWithInworldAI(message);
      // Send AI response back to the client
      ws.send(JSON.stringify(aiResponse));
    } catch (error) {
      console.error('Error processing AI interaction:', error);
      ws.send(JSON.stringify({ error: 'Error processing AI interaction' }));
    }*/
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
//app.use(express.static(path.join(__dirname)));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist'))); // for distribution

app.get('/api/config', (req, res) => {
  res.json({ 
    SPEECH_KEY: process.env.SPEECH_KEY,
    CONVAI_API_KEY: process.env.CONVAI_API_KEY,
    INWORLD_KEY: process.env.INWORLD_KEY,       // Expose INWORLD_KEY
    INWORLD_SECRET: process.env.INWORLD_SECRET, // Expose INWORLD_SECRET
    INWORLD_SCENE: process.env.INWORLD_SCENE    // Expose INWORLD_SCENE
  });
});

/*
app.post('/api/inworld-interaction', (req, res) => {
  const userInput = req.body.text;
  interactWithInworldAI(userInput, (messages) => {
      res.json({ messages });
  });
});
*/

// Start the server
const port = process.env.PORT || 3000;
const port2 = port + 1;
server.listen(port2, () => {
    console.log(`Server running on port ${port2}`);
});

app.listen(port, () => {
  console.log(`app running on port ${port}`);
  //console.log(`ConvAI API Key: ${process.env.INWORLD_SCENE}`); // Test log for CONVAI_API_KEY
});

