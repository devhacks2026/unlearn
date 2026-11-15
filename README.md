# 🧠 Unlearn
### Discover what you don't know.

**Unlearn** is an AI-powered study companion that helps students identify gaps in their understanding, challenge misconceptions, and learn through active reasoning instead of memorization.

Rather than immediately giving students the correct answer, Unlearn asks adaptive follow-up questions to help them discover what they truly understand.

## 💡 The Problem

Most study apps focus on helping students memorize information or providing explanations.

But there's a bigger problem: **students don't always know what they don't know.**

A student might feel confident about a concept without realizing their understanding is incomplete or incorrect.

## ✨ Our Solution

Unlearn uses **Google's Gemini API** to turn studying into an interactive conversation.

1. **Create a study channel** — Organize different subjects and topics.
2. **Explain what you know** — Teach Unlearn a concept in your own words.
3. **Get adaptive questions** — Gemini challenges your reasoning and investigates potential misconceptions.
4. **Track your understanding** — See which concepts you've demonstrated understanding of and which need more work.
5. **Revisit your learning** — Return to previous conversations and review knowledge gaps.

## 🚀 What Makes Unlearn Different From Using Regular AI Chatbots?

- **Adaptive AI tutoring, without constant prompting:** Students don't have to repeatedly remind the AI not to reveal answers. Unlearn uses built-in tutoring instructions that encourage Gemini to ask thoughtful follow-up questions, challenge reasoning, and guide students toward discovering answers themselves.
- **Organized study channels:** Keep different subjects and topics in separate, easily accessible channels, with their own conversation histories. No more scrolling through unrelated AI chats to find previous study sessions.
- **Personalized understanding tracker:** Instead of simply marking answers right or wrong, Unlearn identifies concepts students understand, areas that need improvement, and potential misconceptions, along with explanations of why they were flagged.
- **Learning through reasoning, not memorization:** Students explain concepts in their own words and answer targeted questions that test whether they genuinely understand the material.
- **Personal review board (future feature):** A personalized space where students can revisit unresolved knowledge gaps, track learning progress, and access targeted practice recommendations.

**Unlearn doesn't just help students study more. It helps them study what they actually need to understand.**

## 🛠️ Tech Stack

| Frontend | Backend & AI | Storage |
|---|---|---|
| React | Node.js + Express | Browser localStorage |
| TypeScript | Google Gemini API | Database planned |
| Vite + Tailwind CSS | Google GenAI SDK | |

## ⚙️ Getting Started

**1. Clone the repository and install dependencies**

```bash
git clone https://github.com/YOUR-USERNAME/unlearn.git
cd unlearn
npm install
cd server
npm install
```

**2. Configure Gemini**

Create a `server/.env` file:

```env
GEMINI_API_KEY=your_api_key_here
```

Get an API key from [Google AI Studio](https://aistudio.google.com/apikey).

**3. Start the backend**

From the `server` folder:

```bash
npm run dev
```

**4. Start the frontend**

In a second terminal, from the project root:

```bash
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

## 🌱 Future Plans

- Personalized practice questions and end-of-session review plans
- PDF and class-note uploads
- Voice-based tutoring
- Spaced repetition and long-term learning insights
- Cloud database and cross-device study history