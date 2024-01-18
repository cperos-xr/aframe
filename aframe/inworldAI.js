const { InworldClient, status } = require('@inworld/nodejs-sdk');

async function interactWithInworldAI(userInput, ws) {
    const client = new InworldClient()
        .setApiKey({
            key: process.env.INWORLD_KEY,
            secret: process.env.INWORLD_SECRET,
        })
        .setUser({ fullName: 'Your name' })
        .setConfiguration({
            capabilities: { emotions: true },
        })
        .setScene(process.env.INWORLD_SCENE)
        .setOnError((err) => {
            switch (err.code) {
                case status.ABORTED:
                case status.CANCELLED:
                    break;
                default:
                    console.error(`Error: ${err.message}`);
                    break;
            }
        }) // End of setOnError

        .setOnMessage((packet) => {
            // TEXT
            if (packet.isText()) {
                console.log(`Text: ${packet.text.text}`); // Log for debugging
                ws.send(JSON.stringify({ message: packet.text.text }));
            }
        
            // EMOTION
            if (packet.isEmotion()) {
                console.log(`Emotions:
                    behavior = ${packet.emotions.behavior.code},
                    strength = ${packet.emotions.strength.code}
                `);
            }
        
            // INTERACTION_END
            if (packet.isInteractionEnd()) {
                console.log("Ending connection");
                connection.close();
            }
        }); // End of setOnMessage

    const connection = client.build();


    //Send user input
    try {
        await connection.sendText(userInput);
    } catch (error) {
        console.error('Error sending text to AI:', error);
        ws.send(JSON.stringify({ error: 'Error communicating with AI' }));
    }
}

module.exports = { interactWithInworldAI };
