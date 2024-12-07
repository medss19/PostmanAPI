const axios = require('axios');

async function summarizeText(text) {
  // Validate input
  if (!text || text.trim().length < 200) {
    throw new Error('Text must be at least 200 characters long');
  }

  // Prepare the request data
  let data = JSON.stringify({
    "inputs": text,
    "parameters": {
      "max_length": 150,
      "min_length": 30,
      "do_sample": false
    }
  });

  // Configuration for the API request
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer ' + process.env['ACCESS_TOKEN']
    },
    data : data,
    // Increase timeout to handle longer texts
    timeout: 30000
  };

  try {
    const response = await axios.request(config);

    // Extract summary text, handling different response formats
    const summary = response.data[0]?.summary_text || 
                    response.data[0] || 
                    'Unable to generate summary';

    return summary;
  }
  catch (error) {
    console.error('Summarization API Error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to summarize text');
  }
}

// Allows for summarizeText() to be called outside of this file
module.exports = summarizeText;