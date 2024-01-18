const express = require('express');
const expressWs = require('express-ws')(express());
const app = expressWs.app;

const http = require('http');
const WebSocket = require('ws');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

// WebSocket connection handler
wss.on('connection', function connection(ws) {
    console.log("WebSocket client connected");
  
    // Message event handler
    ws.on('message', function incoming(message) {
        console.log('Received message: %s', message);
  
        // Echo the received message back to the client
        ws.send(`Echo: ${message}`);
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
    ws.send('Welcome to the WebSocket server!');
  });

app.ws('/echo', (ws, req) => {
    ws.on('message', (msg) => {
        ws.send(msg);
    });
});

app.get('/', (req, res, next) => {
    // Handle HTTP GET request
    res.send('Hello World4');
});


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
