import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { generateSmartResponse } from "../data/chatScript";

// Intent recognition patterns
const intentPatterns = {
  "game-recommendation": [
    "recommend",
    "recommendation",
    "suggest",
    "suggestion",
    "what game",
    "which game",
    "looking for",
    "searching for",
    "need a game",
    "want to play",
    "good game",
  ],
  "popular-games": ["popular", "trending", "hot", "top", "best", "what's popular", "what's hot", "most played", "favorite", "best games", "top games"],
  "game-help": ["help", "stuck", "problem", "issue", "trouble", "difficulty", "can't", "how to", "need help", "assist", "support", "guide", "walkthrough"],
  "new-releases": ["new", "release", "released", "coming soon", "upcoming", "latest", "recent", "new games", "what's new", "just released", "fresh"],
  "genre-action": ["action", "shooter", "fps", "combat", "fighting", "battle", "war"],
  "genre-rpg": ["rpg", "role playing", "roleplay", "fantasy", "story", "character", "level up"],
  "genre-strategy": ["strategy", "tactical", "puzzle", "chess", "planning", "management"],
  "genre-adventure": ["adventure", "exploration", "quest", "journey", "discover"],
  "genre-sports": ["sport", "sports", "football", "soccer", "basketball", "racing", "car"],
};

// Detect intent from user message
const detectIntent = (message) => {
  const lowerMessage = message.toLowerCase();

  for (const [intent, patterns] of Object.entries(intentPatterns)) {
    if (patterns.some((pattern) => lowerMessage.includes(pattern))) {
      return intent;
    }
  }

  // Check for greetings
  if (lowerMessage.includes("hi") || lowerMessage.includes("hello") || lowerMessage.includes("hey")) {
    return "greeting";
  }

  // Check for thanks
  if (lowerMessage.includes("thank") || lowerMessage.includes("thanks") || lowerMessage.includes("thx")) {
    return "thanks";
  }

  return null;
};

export const useSimulatedChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [started, setStarted] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Get current user from localStorage
  const currentUser = useMemo(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser).username : "Player";
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Simulate typing delay
  const simulateTypingDelay = useCallback(async (minDelay = 800, maxDelay = 2000) => {
    setIsTyping(true);
    const delay = Math.random() * (maxDelay - minDelay) + minDelay;
    await new Promise((resolve) => setTimeout(resolve, delay));
    setIsTyping(false);
  }, []);

  // Add message to state
  const addMessage = useCallback(
    (message, sender = "user") => {
      const newMsg = {
        id: Date.now() + Math.random(),
        sender,
        content: message,
        timestamp: new Date().toISOString(),
        senderUsername: sender === "user" ? currentUser : "Gaming Assistant",
      };
      setMessages((prev) => [...prev, newMsg]);
      return newMsg;
    },
    [currentUser],
  );

  // Send message with intelligent response generation
  const sendMessage = useCallback(
    async (messageText) => {
      const trimmed = messageText.trim();
      if (!trimmed) return;

      if (!started) {
        setStarted(true);
      }

      // Add user message
      addMessage(trimmed, "user");
      setNewMessage("");
      inputRef.current?.focus();

      // Simulate AI response
      await simulateTypingDelay();

      // Detect intent and generate intelligent response
      const detectedIntent = detectIntent(trimmed);
      const response = generateSmartResponse(trimmed, messages, detectedIntent);

      addMessage(response, "assistant");
    },
    [started, addMessage, simulateTypingDelay, messages],
  );

  // Handle input change
  const handleInputChange = useCallback((e) => {
    setNewMessage(e.target.value);
  }, []);

  // Handle key press
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (newMessage.trim()) {
          sendMessage(newMessage);
        }
      }
    },
    [newMessage, sendMessage],
  );

  // Format timestamp
  const formatTime = useCallback((iso) => {
    try {
      return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  }, []);

  // Clear chat
  const clearChat = useCallback(() => {
    setMessages([]);
    setStarted(false);
  }, []);

  // Memoized values
  const chatState = useMemo(
    () => ({
      messages,
      newMessage,
      isTyping,
      started,
      currentUser,
    }),
    [messages, newMessage, isTyping, started, currentUser],
  );

  const chatActions = useMemo(
    () => ({
      sendMessage,
      handleInputChange,
      handleKeyDown,
      clearChat,
      scrollToBottom,
    }),
    [sendMessage, handleInputChange, handleKeyDown, clearChat, scrollToBottom],
  );

  const chatRefs = useMemo(
    () => ({
      messagesEndRef,
      inputRef,
    }),
    [],
  );

  return {
    ...chatState,
    ...chatActions,
    ...chatRefs,
    formatTime,
  };
};
