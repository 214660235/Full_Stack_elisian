import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import cors from 'cors';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
console.log('API Key:', apiKey); 

const app = express();

app.use(cors());
app.use(express.json());

app.post('/test-connection', async (req, res) => {
  const prompt = 'This is a test connection to OpenAI API. Please confirm the connection is successful.';

  try {
    console.log('Sending request to OpenAI API...');
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    console.log('Response received from OpenAI:', response.data);
    res.send('Successfully connected to OpenAI Chat GPT API');
  } catch (error) {
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    res.status(500).send('Unable to connect to OpenAI');
  }
});

const port = process.env.PORT || 8989;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
