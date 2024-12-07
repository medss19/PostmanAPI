const axios = require('axios');

async function convertTextToImage(text) {
  // Ensure text is extracted correctly from the request body
  const inputText = text;

  // Dynamically calculate image size based on text length
  // Base width and height, with scaling factor
  const baseSize = 512;
  const scaleFactor = 0.5; // Adjust this to control size increase
  const textLengthFactor = Math.min(Math.sqrt(inputText.length) * scaleFactor, 3); // Limit maximum scaling

  const width = Math.round(baseSize * textLengthFactor);
  const height = Math.round(baseSize * textLengthFactor);

  // Ensure minimum and maximum sizes
  const finalWidth = Math.max(512, Math.min(width, 1024));
  const finalHeight = Math.max(512, Math.min(height, 1024));

  // Prepare the request data for the text-to-image API
  let data = JSON.stringify({
    "inputs": inputText,
    "parameters": {
      "negative_prompt": "low quality, blurry",
      "width": finalWidth,
      "height": finalHeight
    }
  });

  // Configuration for the API request
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api-inference.huggingface.co/models/ZB-Tech/text-to-image',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer ' + process.env['ACCESS_TOKEN']
    },
    data: data,
    // Set a longer timeout as image generation can take time
    timeout: 60000,
    // Specify that we want a blob response
    responseType: 'arraybuffer'
  };

  try {
    // Make the API request
    const response = await axios.request(config);

    // Return the image data directly
    return response.data;
  }
  catch (error) {
    console.error('Error converting text to image:', error);
    throw error;
  }
}

// Allow the function to be used in other files
module.exports = convertTextToImage;