// Enhanced chat script with intelligent response integration
export const chatScript = [
  {
    id: "greeting",
    user: "assistant",
    message: "Hi! I'm your gaming assistant. How can I help you today?",
    delay: 0,
    keywords: ["hi", "hello", "hey", "greeting"],
    intent: "greeting",
  },
];

// Smart response templates based on context and intent
export const responseTemplates = {
  greeting: [
    "Hello there! I'm your gaming assistant. Ready to discover some amazing games?",
    "Hi! Great to see you! What gaming adventure can I help you with today?",
    "Hey! I'm excited to help you find your next favorite game. What are you in the mood for?",
  ],

  "game-recommendation": [
    "I'd love to help you find the perfect game! What genre interests you most? Action, RPG, Strategy, Adventure, or Sports?",
    "Great! Let me find some amazing games for you. What type of gaming experience are you looking for?",
    "Absolutely! I can recommend some fantastic games. What's your favorite genre or what are you in the mood for?",
  ],

  "popular-games": [
    "Let me show you what's trending right now! The hottest games this week include Cyber Strike, Dragon's Legacy, and Neon Racer. Which genre interests you?",
    "Great choice! Here are the top games everyone's playing: Cyber Strike (FPS), Dragon's Legacy (RPG), and Neon Racer (Racing). Want details on any?",
    "Perfect! The most popular games right now are action-packed RPGs and realistic racing games. What sounds appealing to you?",
  ],

  "game-help": [
    "I'm here to help! What specific issue are you facing? Are you stuck on a level, need technical support, or looking for tips?",
    "Don't worry, I can definitely help! What game are you playing and what kind of assistance do you need?",
    "I've got your back! Tell me what's challenging you and I'll provide the best guidance I can.",
  ],

  "new-releases": [
    "Exciting! There are some amazing new releases this month. Cyber Strike just launched with incredible graphics, and Dragon's Legacy is getting rave reviews. Want to hear more?",
    "Great timing! This month has seen some incredible releases. We have new FPS games, RPG adventures, and racing simulators. What interests you?",
    "Perfect! The latest releases include Quantum Break (time-bending FPS) and Fantasy Quest VR (immersive RPG). Which catches your eye?",
  ],

  "genre-action": [
    "Action games are awesome! I highly recommend Cyber Strike for intense FPS action, or Shadow Warriors if you like combat with RPG elements. Which sounds better?",
    "Great choice! For action fans, Cyber Strike offers incredible multiplayer battles, while Neon Racer provides high-speed thrills. What's your preference?",
  ],

  "genre-rpg": [
    "RPGs are fantastic! Dragon's Legacy offers a 100+ hour epic adventure, while Stellar Odyssey takes you to space. Which world would you like to explore?",
    "Perfect! For RPG lovers, I'd suggest Dragon's Legacy for classic fantasy or Mystic Realms for online multiplayer. What sounds appealing?",
  ],

  "genre-strategy": [
    "Strategy games really make you think! I'd recommend tactical puzzle games or management simulations. What type of challenge are you looking for?",
    "Excellent choice! Strategy games offer deep gameplay. Are you interested in turn-based tactics or real-time strategy?",
  ],

  "genre-adventure": [
    "Adventure games are amazing for exploration! You could try fantasy quests or mystery adventures. What kind of world do you want to discover?",
    "Great! Adventure games offer incredible stories. Are you looking for epic quests or mysterious journeys?",
  ],

  "genre-sports": [
    "Sports games are fantastic! Neon Racer offers incredible racing simulation, or you could try team sports games. What's your favorite sport?",
    "Perfect! For sports fans, we have realistic racing simulations and team sports games. What interests you most?",
  ],
};

// Game database for detailed recommendations
export const gameDatabase = {
  "cyber-strike": {
    name: "Cyber Strike",
    genre: "FPS",
    description: "Futuristic shooter set in 2077 Tokyo with amazing graphics",
    features: ["Smooth gunplay with 50+ weapons", "20-hour campaign in neon-lit Tokyo", "16-player multiplayer battles", "4.8/5 rating from 10,000+ players"],
    details: {
      gameplay: "Fast-paced FPS with tactical elements and customization",
      story: "Cyberpunk narrative about corporate warfare and hacking",
      multiplayer: "16-player battles with custom modes and rankings",
      requirements: "Requires modern gaming PC or current-gen console",
    },
  },

  "dragon-legacy": {
    name: "Dragon's Legacy",
    genre: "RPG",
    description: "Epic fantasy adventure with massive open world",
    features: [
      "Open world bigger than Skyrim",
      "120-hour main quest + 200+ side quests",
      "Real-time with pause tactical combat",
      "Choices that shape the world",
    ],
    details: {
      gameplay: "Deep RPG mechanics with character progression",
      story: "Epic tale of dragons, magic, and destiny",
      multiplayer: "Online co-op for main story and side quests",
      character: "Extensive character creation with classes and skills",
    },
  },

  "neon-racer": {
    name: "Neon Racer",
    genre: "Racing",
    description: "Ultimate street racing experience with stunning visuals",
    features: [
      "200+ licensed cars from 50 manufacturers",
      "50 tracks worldwide with dynamic weather",
      "4K graphics with ray tracing",
      "Global tournaments with $1M prizes",
    ],
    details: {
      gameplay: "Realistic physics simulation with arcade accessibility",
      cars: "From supercars to classic muscle cars",
      tracks: "City circuits, mountain roads, and professional circuits",
      multiplayer: "Online tournaments and seasonal events",
    },
  },

  "shadow-warriors": {
    name: "Shadow Warriors",
    genre: "Action-RPG",
    description: "Intense combat with RPG elements and deep story",
    features: [
      "Fluid sword fighting with magic combos",
      "30-hour epic story of honor and revenge",
      "6 playable heroes with unique abilities",
      "Game of the Year 2023 winner",
    ],
    details: {
      gameplay: "Hybrid combat system mixing melee and magic",
      story: "Tale of warriors seeking redemption",
      multiplayer: "4-player co-op campaign and arena battles",
      characters: "Each hero has unique skill trees and weapons",
    },
  },
};

// Context-aware response generator
export const generateSmartResponse = (userMessage, conversationHistory, detectedIntent) => {
  const message = userMessage.toLowerCase();

  // Check for specific game mentions
  for (const [gameKey, gameData] of Object.entries(gameDatabase)) {
    if (message.includes(gameKey.replace("-", " ")) || message.includes(gameData.name.toLowerCase())) {
      return generateGameSpecificResponse(gameData, message);
    }
  }

  // Use intent-based responses
  if (detectedIntent && responseTemplates[detectedIntent]) {
    const templates = responseTemplates[detectedIntent];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  // Check for follow-up questions
  if (conversationHistory.length > 0) {
    const lastMessage = conversationHistory[conversationHistory.length - 1];
    if (lastMessage.senderUsername === "Gaming Assistant") {
      return generateFollowUpResponse(message, lastMessage.content);
    }
  }

  // Default contextual responses
  return generateContextualDefault(message);
};

const generateGameSpecificResponse = (gameData, userMessage) => {
  if (userMessage.includes("how") || userMessage.includes("gameplay")) {
    return `${gameData.name} is incredible! ${gameData.details.gameplay} Want to know about the story or multiplayer features?`;
  }

  if (userMessage.includes("story") || userMessage.includes("plot")) {
    return `The story of ${gameData.name} is amazing! ${gameData.details.story} Interested in the gameplay mechanics?`;
  }

  if (userMessage.includes("multiplayer") || userMessage.includes("online")) {
    return `${gameData.name} has fantastic multiplayer! ${gameData.details.multiplayer} Want to know about single-player content?`;
  }

  return `${gameData.name} is a fantastic ${gameData.genre}! ${gameData.description} Key features include: ${gameData.features.slice(0, 2).join(", ")}. What would you like to know more about?`;
};

const generateFollowUpResponse = (userMessage) => {
  if (userMessage.includes("more") || userMessage.includes("tell me")) {
    return "I'd be happy to share more details! What specific aspect interests you most - gameplay, story, graphics, or multiplayer features?";
  }

  if (userMessage.includes("price") || userMessage.includes("cost")) {
    return "Great question! Most new releases range from $39.99 to $69.99 depending on the edition. Many games also have seasonal discounts. Would you like to know about current deals?";
  }

  if (userMessage.includes("requirements") || userMessage.includes("system")) {
    return "For optimal performance, I recommend a modern gaming PC with at least 8GB RAM and a dedicated graphics card. Console versions are optimized for each platform. What platform are you planning to play on?";
  }

  return "That's a great follow-up question! Let me give you more detailed information about that.";
};

const generateContextualDefault = (message) => {
  if (message.includes("?")) {
    return "Interesting question! Based on your interests, I'd recommend exploring either action games or RPGs. What type of gaming experience appeals to you most?";
  }

  if (message.includes("boring") || message.includes("fun")) {
    return "Let me help you find something exciting! Based on current trends, you might enjoy fast-paced action games or immersive RPGs. What sounds more appealing?";
  }

  return "I understand! Gaming preferences are very personal. Would you prefer something competitive and intense, or more relaxed and story-driven?";
};

export const getGreetingMessage = () => {
  const hour = new Date().getHours();
  let greeting = "Hello";

  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";
  else greeting = "Good evening";

  return `${greeting}! I'm your gaming assistant. How can I help you today?`;
};

export const getFallbackResponses = () => [
  "That's interesting! Tell me more about what you're looking for.",
  "I'd be happy to help you find the perfect game!",
  "Based on your preferences, I think you might enjoy some of our featured games.",
  "Let me help you discover something amazing!",
  "Great question! What type of gaming experience are you looking for?",
  "I can definitely help with that! What specifically interests you?",
  "Excellent choice! Let me find the best options for you.",
  "Tell me more about what you enjoy in games!",
];

// Helper function to find script item by ID
export const findScriptById = (id) => {
  return chatScript.find((item) => item.id === id);
};

// Helper function to get next script item
export const getNextScriptItem = (currentId, responseText) => {
  const currentItem = findScriptById(currentId);
  if (currentItem && currentItem.responses) {
    const response = currentItem.responses.find((r) => r.text.toLowerCase().includes(responseText.toLowerCase()));
    if (response && response.nextId) {
      return findScriptById(response.nextId);
    }
  }
  return null;
};
