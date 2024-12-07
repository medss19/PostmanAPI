document.addEventListener('DOMContentLoaded', () => {
  // Summarization Section
  const submitButton = document.getElementById('submit-button');
  const textToSummarize = document.getElementById('text_to_summarize');
  const summary = document.getElementById('summary');

  // Text to Image Section
  const convertButton = document.getElementById('convert-button');
  const textToConvert = document.getElementById('text_to_convert');
  const generatedImage = document.getElementById('generated-image');

  // Default image (learning.png)
  const defaultImageSrc = 'images/learning.png';

  // Set default image initially
  generatedImage.src = defaultImageSrc;
  generatedImage.style.display = 'block';

  // Summarization Button Event Listener
  submitButton.addEventListener('click', () => {
    const text = textToSummarize.value.trim();
    
    if (text.length < 200 || text.length > 100000) {
      alert('Text must be between 200 and 100,000 characters.');
      return;
    }

    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Summarizing...';

    fetch('/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({ text_to_summarize: text })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Update summary text
      summary.value = data.summary;
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to summarize text: ' + error.message);
    })
    .finally(() => {
      // Re-enable button
      submitButton.disabled = false;
      submitButton.textContent = 'Summarize';
    });
  });

  // Text to Image Button Event Listener
  convertButton.addEventListener('click', () => {
    const text = textToConvert.value.trim();
    
    if (text.length === 0 || text.length > 500) {
      alert('Text must be between 1 and 500 characters.');
      return;
    }

    // Show loading state
    convertButton.disabled = true;
    convertButton.textContent = 'Generating...';

    fetch('/convert-to-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text_to_convert: text })
    })
    .then(response => {
      // Check if the response is okay
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob();
    })
    .then(blob => {
      // Create an object URL from the blob
      const imageUrl = URL.createObjectURL(blob);
      generatedImage.src = imageUrl;
      generatedImage.style.display = 'block';
    })
    .catch(error => {
      console.error('Error:', error);
      // Revert to default image on error
      generatedImage.src = defaultImageSrc;
      alert('Failed to generate image: ' + error.message);
    })
    .finally(() => {
      convertButton.disabled = false;
      convertButton.textContent = 'Generate Image';
    });
  });
});