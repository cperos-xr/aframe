//const fs = require("fs");
const sdk = require("microsoft-cognitiveservices-speech-sdk");

// This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);
speechConfig.speechRecognitionLanguage = "en-US";

function recognizeSpeech(audioBlob) {
    console.log('recognizeSpeech function called'); // Add this line
    let audioConfig = sdk.AudioConfig.(audioBlob);
    let speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    // Get the recognizedText entity from the A-Frame scene
    let recognizedTextEntity = document.querySelector('#recognizedTextResult');

    speechRecognizer.recognizeOnceAsync(result => {
        switch (result.reason) {
            case sdk.ResultReason.RecognizedSpeech:
                const recognizedText = result.text;
                console.log(`RECOGNIZED: Text=${recognizedText}`);

                // Set the recognized text to the A-Frame entity
                recognizedTextEntity.setAttribute('value', recognizedText);
                
                break;
            case sdk.ResultReason.NoMatch:
                console.log("NOMATCH: Speech could not be recognized.");
                break;
            case sdk.ResultReason.Canceled:
                const cancellation = sdk.CancellationDetails.fromResult(result);
                console.log(`CANCELED: Reason=${cancellation.reason}`);

                if (cancellation.reason == sdk.CancellationReason.Error) {
                    console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
                    console.log(`CANCELED: ErrorDetails=${cancellation.errorDetails}`);
                    console.log("CANCELED: Did you set the speech resource key and region values?");
                }
                break;
        }
        speechRecognizer.close();
    });
}


// Export the recognizeSpeech function so it can be used in your A-Frame project
module.exports = recognizeSpeech;
