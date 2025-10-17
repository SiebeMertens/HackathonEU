// Google AI Studio (Gemini) API Service
// Documentation: https://ai.google.dev/

const GEMINI_API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent`;

/**
 * Generate cybersecurity assessment questions using Google's Gemini AI
 * @param {string} domain - The cybersecurity domain (network-security, secure-coding, incident-response)
 * @param {string} difficulty - Question difficulty (beginner, intermediate, advanced)
 * @param {number} count - Number of questions to generate
 * @param {string} apiKey - Google AI Studio API key
 * @returns {Promise<Array>} Array of generated questions
 */
export async function generateQuestions(domain, difficulty, count = 1, apiKey) {
  if (!apiKey) {
    throw new Error('Google AI Studio API key is required');
  }

  const domainDescriptions = {
    'network-security': 'network security, firewalls, intrusion detection, DDoS attacks, network protocols',
    'secure-coding': 'secure software development, OWASP vulnerabilities, SQL injection, XSS, secure authentication',
    'incident-response': 'cybersecurity incident response, forensics, containment, recovery, threat hunting'
  };

  const difficultyDescriptions = {
    'beginner': 'basic foundational concepts suitable for beginners with clear straightforward scenarios',
    'intermediate': 'moderate complexity requiring practical knowledge and real-world application',
    'advanced': 'complex scenarios requiring expert-level analysis and decision-making'
  };

  const prompt = `You are a cybersecurity education expert. Generate ${count} multiple-choice assessment question(s) for ${domainDescriptions[domain]} at ${difficultyDescriptions[difficulty]} level.

REQUIREMENTS:
- Each question must be realistic and based on real-world scenarios
- Align with NIST Cybersecurity Framework, ENISA, and ECSO standards
- Create a scenario-driven question with a compelling title and context (1-2 sentences of scenario setup)
- Provide 4 answer options (A, B, C, D) that are detailed and meaningful
- Include detailed explanation (200-250 words) with checkmarks (✓) for correct reasoning and (✗) for why other options are wrong
- Add 3-4 key learning points
- Include 2-3 reputable source URLs (NIST, ENISA, OWASP, CWE, CVE, academic papers, or authoritative cybersecurity sites)

FORMAT YOUR RESPONSE AS VALID JSON ARRAY:
[
  {
    "title": "Compelling scenario title",
    "context": "Brief scenario context (1-2 sentences setting up the situation)",
    "question": "Clear, specific question text asking for best course of action or solution",
    "options": [
      "Detailed option A with clear reasoning",
      "Detailed option B with clear reasoning",
      "Detailed option C with clear reasoning",
      "Detailed option D with clear reasoning"
    ],
    "correct": 0,
    "explanation": "Comprehensive explanation covering: ✓ Why the correct answer is best with technical details, ✗ Why each other option is suboptimal or wrong, and best practices to follow.",
    "learningPoints": [
      "Key actionable takeaway 1",
      "Key actionable takeaway 2",
      "Key actionable takeaway 3",
      "Key actionable takeaway 4"
    ],
    "sources": [
      "https://nvlpubs.nist.gov/...",
      "https://www.enisa.europa.eu/...",
      "https://owasp.org/..."
    ],
    "difficulty": "${difficulty}",
    "framework": "NIST CSF / ENISA / ECSO reference"
  }
]

Generate exactly ${count} question(s). Return ONLY the JSON array, no additional text.`;

  try {
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error('Gemini API error: ' + (errorData.error && errorData.error.message ? errorData.error.message : response.statusText));
    }

    const data = await response.json();
    const generatedText = data.candidates[0]?.content?.parts[0]?.text;

    if (!generatedText) {
      throw new Error('No content generated from Gemini API');
    }

    // Extract JSON from response (handle markdown code blocks if present)
    let jsonText = generatedText.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '').trim();
    }

    const questions = JSON.parse(jsonText);

    // Validate and format questions
    return questions.map((q, index) => ({
      id: `ai-${domain}-${difficulty}-${Date.now()}-${index}`,
      title: q.title || '',
      context: q.context || '',
      question: q.question,
      options: q.options,
      correct: q.correct,
      explanation: q.explanation,
      learningPoints: q.learningPoints || [],
      sources: q.sources || [],
      difficulty: difficulty,
      framework: q.framework || 'AI Generated',
      aiGenerated: true,
      generatedAt: new Date().toISOString()
    }));
/**
 * Generate personalized feedback and learning path using Gemini AI
 * @param {string} feedback - User feedback text
 * @param {Array<string>} learningTopics - Array of topics for learning path
 * @param {string} apiKey - Google AI Studio API key
 * @returns {Promise<Object>} Feedback and learning path object
 */
async function generateFeedbackAndLearningPath(feedback, learningTopics, apiKey) {
  if (!apiKey) {
    throw new Error('Google AI Studio API key is required');
  }

  const prompt = `You are a cybersecurity learning coach. Based on the following user feedback and learning topics, generate:
- A short, personalized feedback summary (2-3 sentences)
- A learning path with 3-5 clickable links (URLs) to high-quality resources for each topic
Format your response as valid JSON:
{
  "feedbackSummary": "Personalized feedback summary",
  "learningPath": [
    {
      "topic": "Topic name",
      "resources": [
        { "title": "Resource title", "url": "https://resource-url.com" },
        ...
      ]
    },
    ...
  ]
}
User feedback: ${feedback}
Learning topics: ${learningTopics.join(', ')}
Return ONLY the JSON object, no additional text.`;

  try {
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0]?.content?.parts[0]?.text;

    if (!generatedText) {
      throw new Error('No content generated from Gemini API');
    }

    // Extract JSON from response
    let jsonText = generatedText.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '').trim();
    }

    const result = JSON.parse(jsonText);
    return result;
  } catch (error) {
    console.error('Error generating feedback/learning path with Gemini:', error);
    throw error;
  }
}

  } catch (error) {
    console.error('Error generating questions with Gemini:', error);
    throw error;
  }
}

export { generateFeedbackAndLearningPath };

/**
 * Generate a scenario-based question using Gemini AI
 * @param {string} domain - The cybersecurity domain
 * @param {string} difficulty - Question difficulty
 * @param {string} apiKey - Google AI Studio API key
 * @returns {Promise<Object>} Generated scenario question
 */
export async function generateScenarioQuestion(domain, difficulty, apiKey) {
  if (!apiKey) {
    throw new Error('Google AI Studio API key is required');
  }

  const domainContexts = {
    'network-security': 'network infrastructure, security monitoring, threat detection',
    'secure-coding': 'software development, code review, vulnerability assessment',
    'incident-response': 'security incidents, forensics, crisis management'
  };

  const prompt = `You are a cybersecurity education expert. Create ONE detailed scenario-based assessment question for ${domainContexts[domain]} at ${difficulty} level.

REQUIREMENTS:
- Create a realistic, story-driven scenario (100-150 words of context)
- Include technical details (IP addresses, ports, logs, or code snippets as appropriate)
- Provide 4 detailed answer options
- Write comprehensive explanation (200-250 words) with ✓ for correct reasoning and ✗ for why other options are wrong
- Include 3-4 key actionable learning points
- Add 2-3 reputable source URLs (NIST, ENISA, OWASP, CWE, or authoritative cybersecurity resources)
- Make it engaging and educational

FORMAT YOUR RESPONSE AS VALID JSON:
{
  "title": "Compelling scenario title",
  "context": "Detailed scenario description with realistic technical details, timelines, and context. Make it feel like a real-world situation.",
  "diagram": "Optional: ASCII art diagram or visual representation if applicable",
  "codeSnippet": {
    "language": "python/javascript/bash",
    "code": "Code sample if relevant to scenario"
  },
  "question": "What is the BEST course of action?",
  "options": [
    "Detailed option A with reasoning",
    "Detailed option B with reasoning",
    "Detailed option C with reasoning",
    "Detailed option D with reasoning"
  ],
  "correct": 0,
  "explanation": "Comprehensive explanation with ✓ CORRECT: why this answer is best, ✗ Why other options are suboptimal or wrong, and include technical details and best practices.",
  "learningPoints": [
    "Key actionable learning point 1",
    "Key actionable learning point 2",
    "Key actionable learning point 3",
    "Key actionable learning point 4"
  ],
  "sources": [
    "https://nvlpubs.nist.gov/...",
    "https://www.enisa.europa.eu/...",
    "https://owasp.org/..."
  ]
}

Generate ONE scenario. Return ONLY the JSON object, no additional text.`;

  try {
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 3072,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0]?.content?.parts[0]?.text;

    if (!generatedText) {
      throw new Error('No content generated from Gemini API');
    }

    // Extract JSON from response
    let jsonText = generatedText.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '').trim();
    }

    const scenario = JSON.parse(jsonText);

    // Format scenario question
    return {
      id: `ai-scenario-${domain}-${difficulty}-${Date.now()}`,
      type: 'scenario',
      difficulty: difficulty,
      title: scenario.title,
      context: scenario.context,
      diagram: scenario.diagram || null,
      codeSnippet: scenario.codeSnippet || null,
      question: scenario.question,
      options: scenario.options,
      correct: scenario.correct,
      explanation: scenario.explanation,
      learningPoints: scenario.learningPoints || [],
      aiGenerated: true,
      generatedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error generating scenario with Gemini:', error);
    throw error;
  }
}

/**
 * Test API key validity
 * @param {string} apiKey - Google AI Studio API key
 * @returns {Promise<boolean>} Whether the API key is valid
 */
export async function testApiKey(apiKey) {
  try {
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Hello'
          }]
        }]
      })
    });

    return response.ok;
  } catch (error) {
    return false;
  }
}
