const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const server = http.createServer((request, response) => {
    try {
        // Check for API request
        if (request.url === '/api/config') {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({
                SPEECH_KEY: process.env.SPEECH_KEY,
                CONVAI_API_KEY: process.env.CONVAI_API_KEY,
                INWORLD_KEY: process.env.INWORLD_KEY,
                INWORLD_SECRET: process.env.INWORLD_SECRET,
                INWORLD_SCENE: process.env.INWORLD_SCENE
            }));
            return;
        }

        // Handle static file requests
        let filePath = path.join(__dirname, request.url === '/' ? 'index.html' : request.url);
        if (filePath.endsWith('/')) {
            filePath = path.join(filePath, 'index.html');
        }

        const extname = path.extname(filePath).toLowerCase();
        const contentType = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.ico': 'image/x-icon'
        }[extname] || 'application/octet-stream';

        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT' || error.code === 'EISDIR') {
                    response.writeHead(404);
                    response.end('Not found');
                } else {
                    response.writeHead(500);
                    response.end('Server error: ' + error.code);
                }
                return;
            }
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        });
    } catch (error) {
        response.writeHead(500);
        response.end('Server error: ' + error.message);
    }
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    ws.on('message', (message) => {
        console.log('received: %s', message);
        ws.send(`Echo: ${message}`);
    });
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
