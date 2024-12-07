const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const summarizeText = require('./summarize.js');
const convertTextToImage = require('./convert.js');
require('dotenv').config();

// Enable CORS for all routes
app.use(cors());

// Parses JSON bodies (as sent by API clients)
app.use(express.json());
// Serves static files from the 'public' directory
app.use(express.static('public'));

// Handle POST requests to the '/summarize' endpoint
app.post('/summarize', async (req, res) => {
  try {
    // get the text_to_summarize property from the request body
    const text = req.body.text_to_summarize;

    // Validate input
    if (!text || text.trim().length === 0) {
      return res.status(400).send('No text provided for summarization');
    }

    // call your summarizeText function, passing in the text from the request
    const summary = await summarizeText(text);

    // Send the summary back to the client
    res.json({ summary });
  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).send('Error summarizing text: ' + error.message);
  }
});

// New route for text to image conversion
app.post('/convert-to-image', async (req, res) => {
  try {
    // Extract text from the request body
    const text = req.body.text_to_convert;

    const imageData = await convertTextToImage(text);

    // Set content type to image
    res.contentType('image/png');
    res.send(imageData);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error converting text to image');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});