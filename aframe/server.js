const express = require('express');
const path = require('path');
const app = express();
const dotenv = require('dotenv').config();
//const { InworldClient, status } = require('@inworld/nodejs-sdk');
const { interactWithInworldAI } = require('./inworldAI');

// Serve static files from the project root

app.use(express.static(path.join(__dirname)));
app.use(express.json());


app.get('/api/config', (req, res) => {
  res.json({ 
    SPEECH_KEY: process.env.SPEECH_KEY,
    CONVAI_API_KEY: process.env.CONVAI_API_KEY,
    INWORLD_KEY: process.env.INWORLD_KEY,       // Expose INWORLD_KEY
    INWORLD_SECRET: process.env.INWORLD_SECRET, // Expose INWORLD_SECRET
    INWORLD_SCENE: process.env.INWORLD_SCENE    // Expose INWORLD_SCENE
  });
});

app.post('/api/inworld-interaction', async (req, res) => {
  try {
      const userInput = req.body.text;
      const response = await interactWithInworldAI(userInput);
      res.json(response);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error processing Inworld AI interaction');
  }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  //console.log(`ConvAI API Key: ${process.env.INWORLD_SCENE}`); // Test log for CONVAI_API_KEY
});