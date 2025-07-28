'use client'

import React, { useState, useEffect } from "react";
import {
  Heart,
  Users
} from "lucide-react";
import { modelPersonalities, useCaseOptions, budgetOptions, priorityOptions, volumeOptions } from "../data";

function LLMSpeedDating() {
  const [step, setStep] = useState("intro");
  const [userProfile, setUserProfile] = useState({
    useCase: "",
    budget: "",
    priority: "",
    volume: ""
  });
  const [matches, setMatches] = useState([]);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [loading, setLoading] = useState(false);

  async function fetchModelData() {
    setLoading(true);
    try {
      // Fetch data from the Helicone cost API
      const response = await fetch(
        "https://www.helicone.ai/api/llm-costs?format=json"
      );
      const data = await response.json();

      // Create matches based on user preferences
      const compatibleModels = findCompatibleModels(data.data);
      setMatches(compatibleModels);
    } catch (error) {
      console.error("Failed to fetch model data:", error);
      // Fallback to mock data for demo
      createMockMatches();
    }
    setLoading(false);
  }

  function findPersonalityKey(modelName) {
    const keys = Object.keys(modelPersonalities);
    return keys.find((key) => {
      const cleanModel = modelName.toLowerCase().replace(/[-_]/g, "");
      const cleanKey = key.toLowerCase().replace(/[-_]/g, "");
      return cleanModel.includes(cleanKey) || cleanKey.includes(cleanModel);
    });
  }

  function calculateBudgetScore(avgCost, budget) {
    const budgetScores = {
      startup: { threshold: 5, score: 30, message: "Perfect for your startup budget! 💚" },
      growing: { threshold: 25, score: 25, message: "Great value for growing businesses! 📈" },
      enterprise: { threshold: Infinity, score: 20, message: "Enterprise-ready performance! 🏢" }
    };

    const config = budgetScores[budget];
    return avgCost < config.threshold ? { score: config.score, reason: config.message } : { score: 0, reason: null };
  }

  function calculateUseCaseScore(personalityKey, useCase) {
    const useCaseMatches = {
      chatbot: ["gpt-4o-mini", "claude-3-haiku", "deepseek-chat"],
      content: ["gpt-4o", "claude-3.5-sonnet"],
      analysis: ["claude-3.5-sonnet", "gpt-4o"],
      coding: ["gpt-4o", "deepseek-chat"],
      creative: ["gpt-4o", "claude-3.5-sonnet"],
      research: ["claude-3.5-sonnet", "gpt-4o"],
    };

    const isMatch = useCaseMatches[useCase]?.includes(personalityKey);
    if (!isMatch) return { score: 0, reason: null };

    const useCaseLabel = useCaseOptions.find((uc) => uc.id === useCase)?.label;
    return {
      score: 25,
      reason: `Excellent for ${useCaseLabel}! ✨`
    };
  }

  function calculatePriorityScore(avgCost, priority, personalityKey) {
    const priorityScores = {
      cost: { threshold: 10, score: 20, message: "Super cost-effective! 💰" },
      quality: { threshold: 15, score: 20, message: "Premium quality guaranteed! 👑", condition: avgCost > 15 },
      speed: {
        score: 20,
        message: "Lightning fast responses! ⚡",
        condition: ["claude-3-haiku", "gpt-4o-mini"].includes(personalityKey)
      }
    };

    const config = priorityScores[priority];
    if (!config) return { score: 0, reason: null };

    const isMatch = config.condition !== undefined ? config.condition : avgCost < config.threshold;
    return isMatch ? { score: config.score, reason: config.message } : { score: 0, reason: null };
  }

  function calculateVolumeScore(avgCost, volume) {
    if (volume === "high" && avgCost < 10) {
      return { score: 15, reason: "Perfect for high-volume usage! 🌳" };
    }
    return { score: 0, reason: null };
  }

  function findCompatibleModels(apiData) {
    const modelKeys = Object.keys(modelPersonalities);
    const availableModels = apiData.filter((model) =>
      modelKeys.some(
        (key) =>
          model.model
            .toLowerCase()
            .includes(key.replace(/-/g, "").toLowerCase()) ||
          key
            .toLowerCase()
            .includes(model.model.toLowerCase().replace(/-/g, ""))
      )
    );

    const scoredModels = availableModels
      .map((model) => {
        const personalityKey = findPersonalityKey(model.model);
        const personality = personalityKey
          ? modelPersonalities[personalityKey]
          : null;

        if (!personality) return null;

        const inputCost = model.input_cost_per_1m || 0;
        const outputCost = model.output_cost_per_1m || 0;
        const avgCost = (inputCost + outputCost) / 2;

        const budgetResult = calculateBudgetScore(avgCost, userProfile.budget);
        const useCaseResult = calculateUseCaseScore(personalityKey, userProfile.useCase);
        const priorityResult = calculatePriorityScore(avgCost, userProfile.priority, personalityKey);
        const volumeResult = calculateVolumeScore(avgCost, userProfile.volume);

        const reasons = [
          budgetResult.reason,
          useCaseResult.reason,
          priorityResult.reason,
          volumeResult.reason
        ].filter(Boolean);

        const totalScore = budgetResult.score + useCaseResult.score + priorityResult.score + volumeResult.score;

        return {
          ...personality,
          score: totalScore,
          matchReasons: reasons,
          costData: model,
          matchPercentage: Math.min(
            95,
            Math.max(65, totalScore + Math.random() * 20)
          ),
        };
      })
      .filter(Boolean);

    return scoredModels.sort((a, b) => b.score - a.score).slice(0, 5);
  };

  function createMockMatches() {
    const mockMatches = [
      {
        ...modelPersonalities["gpt-4o-mini"],
        matchPercentage: 92,
        matchReasons: ["Perfect for your budget!", "Great for startups!"],
      },
      {
        ...modelPersonalities["deepseek-chat"],
        matchPercentage: 89,
        matchReasons: ["Super affordable!", "High performance!"],
      },
      {
        ...modelPersonalities["claude-3-haiku"],
        matchPercentage: 85,
        matchReasons: ["Lightning fast!", "Cost effective!"],
      },
    ];
    setMatches(mockMatches);
  }

  function handleStartMatching() {
    setStep("matching");
    fetchModelData();
  }

  const handleProfileUpdate = (field, value) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleNextMatch = () => {
    setCurrentMatch(prev => (prev + 1) % matches.length);
  };

  function handleShareMatch() {
    const match = matches[currentMatch];
    const shareText = `I just found my perfect AI match! 💕

${match.name} (${match.provider})
${match.personality}

"${match.flirtText}"

${Math.round(match.matchPercentage)}% compatibility! 🔥

Try the LLM Speed Dating app: [Your URL here]`;

    navigator.clipboard.writeText(shareText);
    alert("Match details copied to clipboard! Ready to share! 📱");
  }

  function handleStartOver() {
    setStep("intro");
    setUserProfile({
      useCase: "",
      budget: "",
      priority: "",
      volume: "",
    });
    setMatches([]);
    setCurrentMatch(0);
  }

  function isProfileComplete() {
    return userProfile.useCase && userProfile.budget && userProfile.priority && userProfile.volume;
  }

  function renderIntro() {
    return (
      <div className="text-center space-y-6">
        <div className="mb-8">
          <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            LLM Speed Dating 💕
          </h1>
          <p className="text-lg text-gray-600">
            Find your perfect AI match based on your needs and budget!
          </p>
        </div>
        <button
          onClick={function() { setStep("profile"); }}
          className="bg-pink-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-pink-600 transition-colors"
        >
          Start Looking for Love! 💖
        </button>
      </div>
    );
  }

  function renderProfile() {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Create Your Dating Profile
          </h2>
          <p className="text-gray-600">
            Tell us about yourself so we can find your perfect AI match!
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What&apos;s your main use case? 💼
            </label>
            <div className="grid grid-cols-2 gap-3">
              {useCaseOptions.map(function(option) {
                return (
                  <button
                    key={option.id}
                    onClick={function() { handleProfileUpdate("useCase", option.id); }}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      userProfile.useCase === option.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="text-lg mb-1">{option.icon}</div>
                    <div className="text-sm font-medium">{option.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What&apos;s your budget range? 💰
            </label>
            <div className="space-y-2">
              {budgetOptions.map(function(option) {
                return (
                  <button
                    key={option.id}
                    onClick={function() { handleProfileUpdate("budget", option.id); }}
                    className={`w-full p-3 border rounded-lg text-left transition-colors ${
                      userProfile.budget === option.id
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-lg mr-3">{option.icon}</span>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-500">{option.range}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What&apos;s most important to you? ⭐
            </label>
            <div className="grid grid-cols-2 gap-3">
              {priorityOptions.map(function(option) {
                return (
                  <button
                    key={option.id}
                    onClick={function() { handleProfileUpdate("priority", option.id); }}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      userProfile.priority === option.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="text-lg mb-1">{option.icon}</div>
                    <div className="text-sm font-medium">{option.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Expected usage volume? 📊
            </label>
            <div className="space-y-2">
              {volumeOptions.map(function(option) {
                return (
                  <button
                    key={option.id}
                    onClick={function() { handleProfileUpdate("volume", option.id); }}
                    className={`w-full p-3 border rounded-lg text-left transition-colors ${
                      userProfile.volume === option.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-lg mr-3">{option.icon}</span>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-500">{option.desc}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleStartMatching}
            disabled={!isProfileComplete()}
            className="bg-pink-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-pink-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Find My Matches! 💕
          </button>
        </div>
      </div>
    );
  }

  function renderMatching() {
    return (
      <div className="text-center space-y-6">
        <div className="mb-8">
          <div className="animate-pulse">
            <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Finding Your Perfect Matches...
          </h2>
          <p className="text-gray-600">
            Analyzing 300+ models using real pricing data! ✨
          </p>
          <div className="mt-6">
            <div className="bg-gray-200 rounded-full h-2 w-64 mx-auto">
              <div
                className="bg-pink-500 h-2 rounded-full animate-pulse"
                style={{ width: "75%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderMatches() {
    if (matches.length === 0) return null;

    const match = matches[currentMatch];

    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border-2 border-pink-200 p-6 text-center space-y-4">
          <div className="relative">
            <div className="text-6xl mb-4">{match.emoji}</div>
            <div className="absolute top-0 right-0 bg-green-500 text-white rounded-full px-2 py-1 text-sm font-bold">
              {Math.round(match.matchPercentage)}% Match!
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800">{match.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{match.provider}</p>
            <p className="text-lg text-purple-600 font-medium">
              {match.personality}
            </p>
            <p className="text-gray-600 italic">&ldquo;{match.tagline}&rdquo;</p>
          </div>

          <div className="bg-pink-50 rounded-lg p-4">
            <p className="text-gray-700 italic">&ldquo;{match.flirtText}&rdquo;</p>
          </div>

          <div className="text-left space-y-3">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Personality Traits:
              </h4>
              <div className="flex flex-wrap gap-2">
                {match.traits.map(function(trait) {
                  return (
                    <span
                      key={trait}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                    >
                      {trait}
                    </span>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Perfect for:</h4>
              <div className="flex flex-wrap gap-2">
                {match.bestFor.map((use) => (
                  <span
                    key={use}
                    className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm"
                  >
                    {use}
                  </span>
                ))}
              </div>
            </div>

            {match.matchReasons.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Why we matched you:
                </h4>
                <div className="space-y-1">
                  {match.matchReasons.map((reason, idx) => (
                    <p key={idx} className="text-sm text-gray-600">
                      • {reason}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {match.costData && (
              <div className="bg-yellow-50 rounded-lg p-3">
                <h4 className="font-semibold text-gray-800 mb-2">
                  💰 Real Pricing Data:
                </h4>
                <div className="text-sm space-y-1">
                  <p>
                    Input: ${match.costData.input_cost_per_1m?.toFixed(2)}/1M
                    tokens
                  </p>
                  <p>
                    Output: ${match.costData.output_cost_per_1m?.toFixed(2)}/1M
                    tokens
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleNextMatch}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-300 transition-colors"
            >
              Next Match 👀
            </button>
            <button
              onClick={handleShareMatch}
              className="flex-1 bg-pink-500 text-white py-3 rounded-full font-semibold hover:bg-pink-600 transition-colors"
            >
              Share Match! 💕
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-sm text-gray-500">
              Match {currentMatch + 1} of {matches.length} •
              <button
                onClick={handleStartOver}
                className="text-pink-500 hover:underline ml-1"
              >
                Start Over
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  useEffect(function() {
    if (step === "matching") {
      const timer = setTimeout(() => {
        setStep("matches");
      }, 3000);
      return function() { clearTimeout(timer); };
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto py-8">
        {step === "intro" && renderIntro()}
        {step === "profile" && renderProfile()}
        {step === "matching" && renderMatching()}
        {step === "matches" && renderMatches()}

        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            Powered by{" "}
            <a
              href="https://helicone.ai/llm-cost"
              className="text-pink-500 hover:underline"
            >
              Helicone&apos;s LLM Cost API
            </a>
          </p>
          <p>Real pricing data from 300+ AI models! 🚀</p>
        </div>
      </div>
    </div>
  );
}

export default LLMSpeedDating;
