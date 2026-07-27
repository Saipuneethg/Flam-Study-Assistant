import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { z } from 'zod';
import { Groq } from 'groq-sdk';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const StudyPackageSchema = z.object({
  title: z.string(),
  summary: z.string(),
  flashcards: z.array(z.object({
    id: z.string(),
    question: z.string(),
    answer: z.string(),
  })).min(2),
  quiz: z.array(z.object({
    id: z.string(),
    question: z.string(),
    options: z.array(z.string()).length(4),
    correctIndex: z.number().min(0).max(3),
    explanation: z.string()
  })).min(2)
});

const systemPrompt = `You are an expert AI study assistant. Your goal is to take notes provided by the user and generate a study package.
You MUST output ONLY valid, raw JSON matching the requested schema. 
Do NOT include any markdown wrappers (like \`\`\`json), do NOT include explanations before or after the JSON. Just the raw JSON.
The schema is:
{
  "title": "A short, engaging title",
  "summary": "A brief summary of the topic",
  "flashcards": [
    { "id": "unique-id", "question": "Question text", "answer": "Answer text" }
  ],
  "quiz": [
    { 
      "id": "unique-id", 
      "question": "Quiz question text", 
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"], 
      "correctIndex": 0,
      "explanation": "Explanation for the correct answer" 
    }
  ]
}
Flashcards and quiz arrays must have at least 2 items each, but the total number of items should vary dynamically based on the length and detail of the user's notes. Generate more questions and cards (e.g., 5-10+) for longer, detailed notes, and fewer (e.g., 2-3) for brief notes. CRITICAL: Do not always generate the exact same number of flashcards as quiz questions. Vary the counts independently (e.g., 7 flashcards but only 4 quiz questions) depending on what best fits the content. Options array MUST have exactly 4 items. correctIndex must be 0-3.`;

const fetchWithTimeout = async (apiCall, timeoutMs) => {
  return Promise.race([
    apiCall(),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeoutMs))
  ]);
};

const callGroq = async (notes, retryError = null) => {
  const userPrompt = retryError
    ? `The previous response failed schema validation. Please fix it and output ONLY valid JSON.\n\nError details: ${retryError}\n\nOriginal notes: ${notes}`
    : `Generate a study package for the following notes:\n\n${notes}`;

  const completion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.2,
    response_format: { type: 'json_object' }
  });

  return completion.choices[0]?.message?.content || '{}';
};

app.post('/api/generate', async (req, res) => {
  try {
    const { notes } = req.body;
    
    if (!notes || notes.trim().length === 0) {
      return res.status(400).json({ success: false, error: "Notes are required" });
    }

    const processGeneration = async () => {
      // First attempt
      const rawContent = await callGroq(notes);
      try {
        const parsed = JSON.parse(rawContent);
        const validated = StudyPackageSchema.parse(parsed);
        return validated;
      } catch (err) {
        // Retry attempt
        console.warn("Schema validation failed, attempting retry...", err.message);
        const retryRawContent = await callGroq(notes, err.message);
        const retryParsed = JSON.parse(retryRawContent);
        return StudyPackageSchema.parse(retryParsed);
      }
    };

    // 15 seconds timeout
    const result = await fetchWithTimeout(processGeneration, 15000);
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error generating study package:", error);
    if (error.message === 'Timeout') {
      return res.status(504).json({ success: false, error: "Generation timed out" });
    }
    if (error instanceof z.ZodError) {
      return res.status(422).json({ success: false, error: "Schema Validation Failed" });
    }
    res.status(500).json({ success: false, error: "An unexpected error occurred" });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
