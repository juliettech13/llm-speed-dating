export const useCaseOptions = [
  { id: "chatbot", label: "Customer Support Chatbot", icon: "💬" },
  { id: "content", label: "Content Generation", icon: "✍️" },
  { id: "analysis", label: "Data Analysis", icon: "📊" },
  { id: "coding", label: "Code Generation", icon: "💻" },
  { id: "creative", label: "Creative Writing", icon: "🎨" },
  { id: "research", label: "Research Assistant", icon: "🔬" },
];

export const budgetOptions = [
  {
    id: "startup",
    label: "Startup Budget",
    range: "$0-100/month",
    icon: "🏠",
  },
  {
    id: "growing",
    label: "Growing Business",
    range: "$100-1000/month",
    icon: "📈",
  },
  {
    id: "enterprise",
    label: "Enterprise Ready",
    range: "$1000+/month",
    icon: "🏢",
  },
];

export const priorityOptions = [
  { id: "cost", label: "Cost-Effective", icon: "💰" },
  { id: "speed", label: "Lightning Fast", icon: "⚡" },
  { id: "quality", label: "Premium Quality", icon: "👑" },
  { id: "balanced", label: "Balanced", icon: "⚖️" },
];

export const volumeOptions = [
  {
    id: "low",
    label: "Light Usage",
    desc: "<10k requests/month",
    icon: "🌱",
  },
  {
    id: "medium",
    label: "Moderate Usage",
    desc: "10k-100k requests/month",
    icon: "🌿",
  },
  {
    id: "high",
    label: "Heavy Usage",
    desc: "100k+ requests/month",
    icon: "🌳",
  },
];

export const modelPersonalities = {
  "gpt-4o": {
    name: "GPT-4o",
    provider: "OpenAI",
    personality: "The Versatile Virtuoso",
    tagline: "Smart, capable, and ready for anything 🎯",
    traits: ["Well-rounded", "Reliable", "Creative"],
    bestFor: ["General tasks", "Creative work", "Complex reasoning"],
    flirtText:
      "I might cost a bit more, but I promise I&apos;m worth every token 😉",
    emoji: "🤖",
    matchReasons: [],
  },
  "gpt-4o-mini": {
    name: "GPT-4o Mini",
    provider: "OpenAI",
    personality: "The Budget-Friendly Bestie",
    tagline: "Affordable excellence in a compact package 💎",
    traits: ["Cost-effective", "Fast", "Efficient"],
    bestFor: ["High-volume tasks", "Startups", "Simple queries"],
    flirtText:
      "Small price, big personality! Let&apos;s make magic on a budget ✨",
    emoji: "🤏",
    matchReasons: [],
  },
  "claude-3.5-sonnet": {
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    personality: "The Thoughtful Philosopher",
    tagline: "Deep thinking with a gentle touch 🤔",
    traits: ["Thoughtful", "Ethical", "Articulate"],
    bestFor: ["Writing", "Analysis", "Careful reasoning"],
    flirtText:
      "I may take my time to think, but my responses are worth the wait 💭",
    emoji: "🧠",
    matchReasons: [],
  },
  "claude-3-haiku": {
    name: "Claude 3 Haiku",
    provider: "Anthropic",
    personality: "The Speedy Poet",
    tagline: "Quick wit, beautiful responses ⚡",
    traits: ["Fast", "Poetic", "Concise"],
    bestFor: ["Quick responses", "Real-time chat", "Haikus obviously"],
    flirtText:
      "Fast like lightning, / Beautiful like poetry, / Let&apos;s chat together 🌸",
    emoji: "🏃‍♀️",
    matchReasons: [],
  },
  "gemini-2.0-flash": {
    name: "Gemini 2.0 Flash",
    provider: "Google",
    personality: "The Tech Innovator",
    tagline: "Cutting-edge and multimodal 🚀",
    traits: ["Innovative", "Multimodal", "Tech-savvy"],
    bestFor: ["Image analysis", "Multi-format tasks", "Latest features"],
    flirtText: "I speak every language - text, images, you name it! 📸✨",
    emoji: "🌟",
    matchReasons: [],
  },
  "llama-3.1-8b-instruct": {
    name: "Llama 3.1 8B",
    provider: "Meta",
    personality: "The Open Source Hero",
    tagline: "Free-spirited and community-driven 🦙",
    traits: ["Open-source", "Community", "Transparent"],
    bestFor: ["Open source projects", "Customization", "No vendor lock-in"],
    flirtText: "I&apos;m an open book! No secrets, just pure authenticity 📖",
    emoji: "🦙",
    matchReasons: [],
  },
  "deepseek-chat": {
    name: "DeepSeek Chat",
    provider: "DeepSeek",
    personality: "The Budget Champion",
    tagline: "Incredibly smart, surprisingly affordable 🏆",
    traits: ["Super affordable", "High performance", "Underrated"],
    bestFor: ["Budget-conscious projects", "High volume", "Cost optimization"],
    flirtText: "I&apos;m the best-kept secret in AI - amazing value! 💎",
    emoji: "🤫",
    matchReasons: [],
  },
};
