import { ConvaiClient } from 'convai-web-sdk';

let convaiClient;
const charID = '79fde11c-af81-11ee-a698-42010a40000f';

// Immediately Invoked Function Expression (IIFE) to handle async operations
(async () => {
    const convaiConfigResponse = await fetch('/api/config');
    const convaiConfig = await convaiConfigResponse.json();
    var convaiKey = convaiConfig.CONVAI_API_KEY; // Use the key from the server

    // Initialize the ConvaiClient inside the async function
    convaiClient = new ConvaiClient({
        apiKey: convaiKey, // Use the key from the server
        characterId: charID,
        enableAudio: true, // Use false for text only
    });

    // Other related initializations can also go here
})();

export function sendTextToConvAI(text) {
    if (!convaiClient) {
        console.error('ConvAI client is not initialized');
        return;
    }

    // Send text input
    convaiClient.sendTextChunk(text).then(response => {
        // Handle the response
        console.log(response);
    }).catch(error => {
        // Handle any errors
        console.error('Error sending message:', error);
    });
}
