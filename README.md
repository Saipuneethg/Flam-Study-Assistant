Deployed Link:- https://flam-study-assistant-fu.vercel.app/
# Study Assistant - Flam Frontend Internship Assignment

An interactive, responsive Study Assistant app built with React (Vite) and an Express backend proxy. The application takes free-form text, sends it to the Groq API, and generates interactive 3D Flashcards and a smart Quiz with a Re-Test loop for wrong answers.

## Tech Stack
- **Frontend**: React, Vite, Plain CSS (Custom variables), Lucide Icons
- **Backend**: Node.js, Express
- **AI Integration**: Groq API (`llama-3.3-70b-versatile`), Zod (for schema validation)

## 📁 Project Structure
The project is divided into two parts to prevent Vite path issues:
- `/client`: The React frontend application.
- `/server`: The Express backend proxy.

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- A Groq API Key

### Installation
1. Clone the repository and navigate to the project root:
   ```bash
   cd study-assistant
   ```
2. Install all dependencies from the root directory:
   ```bash
   npm run install:all
   ```

### Configuration
1. Navigate to the `server` directory and copy the environment template:
   ```bash
   cd server
   cp .env.example .env
   ```
2. Open `server/.env` and add your Groq API Key:
   ```env
   GROQ_API_KEY=your_actual_api_key_here
   PORT=3001
   ```

### Running the App
From the root directory (`study-assistant`), start both the frontend and backend servers concurrently:
```bash
npm start
```
The frontend will run at `http://localhost:5173` and the backend at `http://localhost:3001`.

##  AI Usage Note
This project was implemented with assistance from Antigravity AI. It handles:
- Code generation and scaffolding for both frontend and backend.
- Designing the custom Field Notebook UI in plain CSS and managing React state.
- Integrating Defensive measures such as Zod schema validation and fetch request deduplication (`AbortController`).

##  Defensive Handling & Architecture
- **API Key Security**: The Groq API key is never exposed in the browser. All requests are securely routed through the backend proxy.
- **Zod Schema Validation**: The backend rigorously checks the JSON output from the LLM. If the generated package is malformed, it automatically requests a repair from the model.
- **Stale Control**: `AbortController` in the React frontend safely terminates older pending requests if the user repeatedly spams the Generate button, preventing overlapping/stale state updates.
- **LocalStorage**: Generated study materials and the Dark Mode preference are saved across sessions automatically.

## ⏱️ Time Spent
Approx. ~7.5 hours.

 Known Limitations
- The backend features a single retry loop for schema validation. In rare cases where the model repeatedly fails JSON synthesis, it returns a 422 error.
- Large input texts might hit LLM context or latency limits. (Timeout is set to 15 seconds).
