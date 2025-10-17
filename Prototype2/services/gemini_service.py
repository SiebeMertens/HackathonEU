"""
Gemini AI Service Module
Handles all interactions with Google's Gemini AI API
"""

import os
import logging
import json
import google.generativeai as genai
from typing import List, Dict, Optional

logger = logging.getLogger(__name__)

class GeminiService:
    """Service class for Gemini AI interactions"""
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize Gemini service with API key"""
        self.api_key = api_key or os.getenv('GEMINI_API_KEY')
        
        if not self.api_key:
            logger.error('Gemini API key not configured')
            raise ValueError('GEMINI_API_KEY environment variable not set')
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-pro')
        logger.info('Gemini AI service initialized successfully')
    
    def generate_question(self, domain: str, difficulty: str) -> Optional[Dict]:
        """
        Generate a single cybersecurity question
        
        Args:
            domain: The cybersecurity domain (network-security, secure-coding, incident-response)
            difficulty: Question difficulty (beginner, intermediate, advanced)
        
        Returns:
            Dictionary containing question data or None if generation fails
        """
        logger.debug(f'Generating question - Domain: {domain}, Difficulty: {difficulty}')
        
        try:
            prompt = self._build_question_prompt(domain, difficulty)
            logger.debug(f'Prompt created, length: {len(prompt)} characters')
            
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=float(os.getenv('AI_TEMPERATURE', 0.7)),
                    max_output_tokens=int(os.getenv('AI_MAX_TOKENS', 2048)),
                )
            )
            
            logger.debug(f'AI response received, processing...')
            question_data = self._parse_question_response(response.text)
            
            if question_data:
                logger.info(f'Question generated successfully: {question_data.get("title", "Untitled")}')
            else:
                logger.warning('Question generation returned empty data')
            
            return question_data
            
        except Exception as e:
            logger.exception(f'Error generating question: {str(e)}')
            return None
    
    def generate_questions_batch(self, domain: str, difficulty: str, count: int = 5) -> List[Dict]:
        """
        Generate multiple questions at once
        
        Args:
            domain: The cybersecurity domain
            difficulty: Question difficulty
            count: Number of questions to generate
        
        Returns:
            List of question dictionaries
        """
        logger.info(f'Generating batch of {count} questions - Domain: {domain}, Difficulty: {difficulty}')
        
        questions = []
        for i in range(count):
            logger.debug(f'Generating question {i+1}/{count}')
            question = self.generate_question(domain, difficulty)
            if question:
                questions.append(question)
            else:
                logger.warning(f'Failed to generate question {i+1}/{count}')
        
        logger.info(f'Generated {len(questions)}/{count} questions successfully')
        return questions
    
    def generate_feedback(self, assessment_data: Dict) -> Optional[Dict]:
        """
        Generate personalized feedback based on assessment results
        
        Args:
            assessment_data: Dictionary containing assessment results
        
        Returns:
            Dictionary containing feedback and learning recommendations
        """
        logger.debug(f'Generating feedback for assessment: {assessment_data.get("domain")}')
        
        try:
            prompt = self._build_feedback_prompt(assessment_data)
            logger.debug(f'Feedback prompt created')
            
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=2048,
                )
            )
            
            logger.debug('Feedback response received, parsing...')
            feedback_data = self._parse_feedback_response(response.text)
            
            if feedback_data:
                logger.info('Feedback generated successfully')
            else:
                logger.warning('Feedback generation returned empty data')
            
            return feedback_data
            
        except Exception as e:
            logger.exception(f'Error generating feedback: {str(e)}')
            return None
    
    def _build_question_prompt(self, domain: str, difficulty: str) -> str:
        """Build the prompt for question generation"""
        
        domain_descriptions = {
            'network-security': 'network security, firewalls, intrusion detection, DDoS attacks, VPNs, network protocols',
            'secure-coding': 'secure software development, OWASP vulnerabilities, SQL injection, XSS, authentication, encryption',
            'incident-response': 'cybersecurity incident response, forensics, containment, recovery, threat hunting, SIEM'
        }
        
        difficulty_descriptions = {
            'beginner': 'basic foundational concepts with clear scenarios',
            'intermediate': 'moderate complexity requiring practical knowledge',
            'advanced': 'complex scenarios requiring expert-level analysis'
        }
        
        prompt = f"""You are a cybersecurity education expert. Create ONE detailed scenario-based assessment question for {domain_descriptions.get(domain, domain)} at {difficulty_descriptions.get(difficulty, difficulty)} level.

REQUIREMENTS:
- Create a realistic, story-driven scenario (100-150 words)
- Include technical details (IP addresses, ports, logs, or code snippets)
- Provide 4 detailed answer options
- Write comprehensive explanation (200-250 words) with ✓ for correct reasoning and ✗ for incorrect
- Include 3-4 key actionable learning points
- Add 2-3 reputable source URLs (NIST, ENISA, OWASP, CWE, or authoritative resources)

FORMAT YOUR RESPONSE AS VALID JSON:
{{
  "title": "Compelling scenario title",
  "context": "Detailed scenario with realistic technical details",
  "question": "What is the BEST course of action?",
  "options": [
    "Detailed option A",
    "Detailed option B",
    "Detailed option C",
    "Detailed option D"
  ],
  "correct": 0,
  "explanation": "Comprehensive explanation with ✓ CORRECT and ✗ WRONG markers",
  "learningPoints": [
    "Key learning point 1",
    "Key learning point 2",
    "Key learning point 3"
  ],
  "sources": [
    "https://nvlpubs.nist.gov/...",
    "https://www.enisa.europa.eu/...",
    "https://owasp.org/..."
  ],
  "difficulty": "{difficulty}",
  "domain": "{domain}"
}}

Return ONLY the JSON object, no additional text."""
        
        return prompt
    
    def _build_feedback_prompt(self, assessment_data: Dict) -> str:
        """Build the prompt for feedback generation"""
        
        prompt = f"""You are a cybersecurity learning coach. Analyze the assessment results and provide personalized feedback and learning recommendations.

ASSESSMENT RESULTS:
- Domain: {assessment_data.get('domain', 'Unknown')}
- Score: {assessment_data.get('score', 0)}%
- Correct: {assessment_data.get('correct', 0)}/{assessment_data.get('total', 0)}
- Difficulty Level: {assessment_data.get('difficulty', 'Mixed')}
- Average Time: {assessment_data.get('avg_time', 0)} seconds per question

REQUIREMENTS:
- Provide encouraging, personalized feedback (2-3 sentences)
- Create learning path with 3-4 high-quality resources
- Include mix of courses, documentation, labs, and articles
- Ensure all URLs are real and accessible

FORMAT YOUR RESPONSE AS VALID JSON:
{{
  "feedbackSummary": "Encouraging, personalized feedback",
  "strengths": [
    "Specific strength 1",
    "Specific strength 2"
  ],
  "improvements": [
    "Area to improve 1",
    "Area to improve 2"
  ],
  "learningPath": [
    {{
      "topic": "Specific topic name",
      "resources": [
        {{
          "title": "Resource title",
          "url": "https://real-url.com",
          "type": "course|documentation|lab|article",
          "description": "Brief description"
        }}
      ]
    }}
  ],
  "nextSteps": [
    "Actionable next step 1",
    "Actionable next step 2",
    "Actionable next step 3"
  ]
}}

Return ONLY the JSON object, no additional text."""
        
        return prompt
    
    def _parse_question_response(self, response_text: str) -> Optional[Dict]:
        """Parse and validate question response from AI"""
        try:
            # Extract JSON from response
            json_text = response_text.strip()
            
            # Remove markdown code blocks if present
            if json_text.startswith('```json'):
                json_text = json_text.replace('```json', '').replace('```', '').strip()
            elif json_text.startswith('```'):
                json_text = json_text.replace('```', '').strip()
            
            logger.debug(f'Parsing JSON response, length: {len(json_text)}')
            question_data = json.loads(json_text)
            
            # Validate required fields
            required_fields = ['title', 'context', 'question', 'options', 'correct', 'explanation']
            for field in required_fields:
                if field not in question_data:
                    logger.error(f'Missing required field: {field}')
                    return None
            
            logger.debug('Question response parsed and validated successfully')
            return question_data
            
        except json.JSONDecodeError as e:
            logger.error(f'JSON parsing error: {str(e)}')
            logger.debug(f'Failed to parse: {response_text[:200]}...')
            return None
        except Exception as e:
            logger.exception(f'Error parsing question response: {str(e)}')
            return None
    
    def _parse_feedback_response(self, response_text: str) -> Optional[Dict]:
        """Parse and validate feedback response from AI"""
        try:
            # Extract JSON from response
            json_text = response_text.strip()
            
            # Remove markdown code blocks if present
            if json_text.startswith('```json'):
                json_text = json_text.replace('```json', '').replace('```', '').strip()
            elif json_text.startswith('```'):
                json_text = json_text.replace('```', '').strip()
            
            logger.debug(f'Parsing feedback JSON, length: {len(json_text)}')
            feedback_data = json.loads(json_text)
            
            # Validate required fields
            required_fields = ['feedbackSummary', 'learningPath']
            for field in required_fields:
                if field not in feedback_data:
                    logger.error(f'Missing required field in feedback: {field}')
                    return None
            
            logger.debug('Feedback response parsed and validated successfully')
            return feedback_data
            
        except json.JSONDecodeError as e:
            logger.error(f'JSON parsing error in feedback: {str(e)}')
            logger.debug(f'Failed to parse: {response_text[:200]}...')
            return None
        except Exception as e:
            logger.exception(f'Error parsing feedback response: {str(e)}')
            return None

# Singleton instance
_gemini_service = None

def get_gemini_service() -> GeminiService:
    """Get or create singleton Gemini service instance"""
    global _gemini_service
    
    if _gemini_service is None:
        logger.debug('Creating new Gemini service instance')
        _gemini_service = GeminiService()
    
    return _gemini_service
