import { useState, useCallback } from 'react';
import { generateQuestions, generateScenarioQuestion, generateFeedbackAndLearningPath } from '../services/geminiApi';

/**
 * Custom hook for managing AI-generated questions
 */
export function useAIQuestions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState(() => {
    // Try to get API key from env or localStorage
    return import.meta.env.VITE_GEMINI_API_KEY || 
           localStorage.getItem('gemini_api_key') || 
           '';
  });

    // Check if AI is enabled - must have a valid API key
    const isEnabled = Boolean(apiKey && apiKey.trim().length > 0);

  /**
   * Save API key to localStorage
   */
  const saveApiKey = useCallback((key) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem('gemini_api_key', key);
    } else {
      localStorage.removeItem('gemini_api_key');
    }
  }, []);

  /**
   * Generate regular questions with AI
   */
  const fetchAIQuestions = useCallback(async (domain, difficulty, count = 2) => {
    if (!apiKey) {
      setError('API key not configured');
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const questions = await generateQuestions(domain, difficulty, count, apiKey);
      setLoading(false);
      return questions;
    } catch (err) {
      console.error('Error fetching AI questions:', err);
      setError(err.message);
      setLoading(false);
      return [];
    }
  }, [apiKey]);

  /**
   * Generate scenario question with AI
   */
  const fetchAIScenario = useCallback(async (domain, difficulty) => {
    if (!apiKey) {
      setError('API key not configured');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const scenario = await generateScenarioQuestion(domain, difficulty, apiKey);
      setLoading(false);
      return scenario;
    } catch (err) {
      console.error('Error fetching AI scenario:', err);
      setError(err.message);
      setLoading(false);
      return null;
    }
  }, [apiKey]);

  /**
   * Generate feedback and learning path with AI
   */
  const fetchFeedbackAndLearningPath = useCallback(async (feedback, learningTopics) => {
    if (!apiKey) {
      setError('API key not configured');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await generateFeedbackAndLearningPath(feedback, learningTopics, apiKey);
      setLoading(false);
      return result;
    } catch (err) {
      console.error('Error fetching AI feedback/learning path:', err);
      setError(err.message);
      setLoading(false);
      return null;
    }
  }, [apiKey]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    apiKey,
    isEnabled,
    saveApiKey,
    fetchAIQuestions,
    fetchAIScenario,
    fetchFeedbackAndLearningPath,
    clearError
  };
}
