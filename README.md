# LLM Speed Dating 💕

Think Tinder, but for Large Language Models!

A fun, interactive web application that helps AI engineers and developers find their perfect LLM match based on use case, budget, priorities, and usage volume.

## What It Does

This app creates a "speed dating" experience for selecting AI models by:

1. **User Profiling**: Collects preferences across 4 categories:
   - **Use Case**: Chatbot, content generation, data analysis, coding, creative writing, research.
   - **Budget**: Startup ($0-100), Growing Business ($100-1000), Enterprise ($1000+).
   - **Priority**: Cost-effective, lightning fast, premium quality, balanced.
   - **Volume**: Light (<10k), Moderate (10k-100k), Heavy (100k+ requests/month).

2. **Real-time Matching**: Fetches live pricing data from [Helicone's LLM Cost API](https://helicone.ai/llm-cost) to match users with compatible models from 700+ available options.

3. **Personality-Based Results**: Each model has a profile with traits, best use cases, and flirty taglines cause it's TINDER FOR LLMS.

## How It Works

### Architecture Overview

```
User Input → Profile Creation → API Call → Scoring Algorithm → Match Display
```

#### LLM Cost API Integration

```typescript
// Fetches real pricing data
const response = await fetch("https://www.helicone.ai/api/llm-costs?format=json");
const data = await response.json();
```

### Supported Models

The app currently supports matching with these major models:
- **OpenAI**: GPT-4o, GPT-4o Mini
- **Anthropic**: Claude 3.5 Sonnet, Claude 3 Haiku
- **Google**: Gemini 2.0 Flash
- **Meta**: Llama 3.1 8B
- **DeepSeek**: DeepSeek Chat

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/llm-speed-dating.git
cd llm-speed-dating

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

## Technical Stack

- **Framework**: Next.js 15.4.2
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Language**: TypeScript
- **Deployment**: Vercel

## License

MIT License - feel free to use this for your own projects!

---

*Built with ❤️ by @juliettech13 for the AI engineering community*
