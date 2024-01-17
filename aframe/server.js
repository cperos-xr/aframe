const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the project root
app.use(express.static(path.join(__dirname)));

app.get('/api/config', (req, res) => {
  res.json({ SPEECH_KEY: process.env.SPEECH_KEY });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
