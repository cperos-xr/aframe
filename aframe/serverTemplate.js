const express = require('express');
const expressWs = require('express-ws')(express());
const app = expressWs.app;

const http = require('http');
const WebSocket = require('ws');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    ws.on('message', (message) => {
        console.log('received: %s', message);
    });
    ws.send('Connection established');
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


const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
