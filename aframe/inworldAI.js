const { InworldClient, status } = require('@inworld/nodejs-sdk');

async function interactWithInworldAI(userInput) {
    const messages = []; // Initialize an array to store messages
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
                messages.push(packet.text.text); // Collect text messages
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
                console.log("ending connection");
                connection.close();
            }
        }); // End of setOnMessage

    const connection = client.build();


    //Send user input
    try {
        await connection.sendText(userInput);

        return { messages }; // Return the collected messages
    } catch (error) {
        throw error;
    }
}

module.exports = { interactWithInworldAI };
