const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 3001;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/ai', async (req, res) => {
  try {
    if (!GOOGLE_API_KEY) {
      return res.status(500).json({ error: 'Server missing GOOGLE_API_KEY in environment' });
    }

    const { userQuestion, context = {} } = req.body;
    if (!userQuestion) return res.status(400).json({ error: 'userQuestion is required' });

    // Build a short system prompt + context
    const systemPrompt = `You are an AI assistant for the AdminDash dashboard. Analyze the following JSON data to answer user questions concisely and professionally: ${JSON.stringify(context)}.`;

    const payload = {
      contents: [
        { parts: [{ text: `Context: ${systemPrompt}\n\nUser Question: ${userQuestion}` }] }
      ]
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GOOGLE_API_KEY}`;

    // Use global fetch (Node 18+). If not available this will throw and we will return an informative error.
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return res.json({ ok: true, data });
  } catch (err) {
    console.error('Error in /api/ai:', err);
    // Helpful error message for missing fetch support
    if (err.message && err.message.includes('fetch is not defined')) {
      return res.status(500).json({ error: 'Server runtime does not have fetch available (requires Node 18+). Install node-fetch or upgrade Node.' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`AI proxy server listening on http://localhost:${PORT}`);
});
