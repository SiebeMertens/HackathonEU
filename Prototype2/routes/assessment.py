"""
Assessment Route Module
Handles assessment creation, questions, and submissions
"""

import logging
import time
from flask import Blueprint, render_template, request, session, redirect, url_for, current_app
from services import get_gemini_service, get_assessment_service

logger = logging.getLogger(__name__)

assessment_bp = Blueprint('assessment', __name__)

@assessment_bp.route('/start', methods=['GET', 'POST'])
def start():
    """Start a new assessment"""
    logger.info('Assessment start page accessed')
    
    if request.method == 'GET':
        # Show domain selection page
        logger.debug('Showing domain selection')
        return render_template('assessment/start.html')
    
    # Handle POST - create new assessment
    try:
        domain = request.form.get('domain', 'network-security')
        difficulty = request.form.get('difficulty', 'beginner')
        
        logger.info(f'Creating assessment - Domain: {domain}, Difficulty: {difficulty}')
        
        # Create assessment
        assessment_service = get_assessment_service()
        assessment = assessment_service.create_assessment(domain, difficulty)
        
        # Store in session
        session['current_assessment'] = assessment
        session['question_start_time'] = None
        
        logger.debug(f'Assessment created with ID: {assessment["id"]}')
        
        # Redirect to questions
        return redirect(url_for('assessment.question'))
    
    except Exception as e:
        logger.exception(f'Error starting assessment: {str(e)}')
        return render_template('errors/500.html'), 500

@assessment_bp.route('/question', methods=['GET', 'POST'])
def question():
    """Display current question or generate next one"""
    logger.info('Question page accessed')
    
    # Check if assessment exists
    if 'current_assessment' not in session:
        logger.warning('No active assessment found, redirecting to start')
        return redirect(url_for('assessment.start'))
    
    assessment = session['current_assessment']
    current_question_index = assessment['current_question']
    
    logger.debug(f'Current question index: {current_question_index}')
    
    # Handle answer submission
    if request.method == 'POST':
        return handle_answer_submission(assessment)
    
    # Check if we need to generate a new question
    if current_question_index >= len(assessment['questions']):
        logger.info('Generating new question')
        return generate_next_question(assessment)
    
    # Display current question
    try:
        question_data = assessment['questions'][current_question_index]
        
        # Set question start time if not already set
        if session.get('question_start_time') is None:
            session['question_start_time'] = time.time()
            logger.debug('Question timer started')
        
        return render_template(
            'assessment/question.html',
            question=question_data,
            question_number=current_question_index + 1,
            total_questions=current_app.config.get('MAX_QUESTIONS_PER_ASSESSMENT', 10),
            assessment=assessment
        )
    
    except Exception as e:
        logger.exception(f'Error displaying question: {str(e)}')
        return render_template('errors/500.html'), 500

def generate_next_question(assessment):
    """Generate the next AI question"""
    logger.info('Generating next AI question')
    
    try:
        gemini_service = get_gemini_service()
        assessment_service = get_assessment_service()
        
        # Generate question
        logger.debug(f'Calling Gemini API - Domain: {assessment["domain"]}, Difficulty: {assessment["difficulty"]}')
        question = gemini_service.generate_question(
            domain=assessment['domain'],
            difficulty=assessment['difficulty']
        )
        
        if not question:
            logger.error('Failed to generate question')
            return render_template(
                'assessment/error.html',
                error='Failed to generate question. Please try again.'
            )
        
        # Add question to assessment
        assessment_service.add_question(assessment, question)
        
        # Update session
        session['current_assessment'] = assessment
        session['question_start_time'] = time.time()
        
        logger.info(f'Question generated successfully: {question.get("title")}')
        
        # Redirect to display the question
        return redirect(url_for('assessment.question'))
    
    except Exception as e:
        logger.exception(f'Error generating question: {str(e)}')
        return render_template('errors/500.html'), 500

def handle_answer_submission(assessment):
    """Handle answer submission"""
    logger.info('Processing answer submission')
    
    try:
        question_id = request.form.get('question_id')
        answer_index = int(request.form.get('answer'))
        
        # Calculate time taken
        start_time = session.get('question_start_time')
        if start_time:
            time_taken = time.time() - start_time
        else:
            time_taken = 0
            logger.warning('No start time found for question')
        
        logger.debug(f'Answer: {answer_index}, Time taken: {time_taken}s')
        
        # Submit answer
        assessment_service = get_assessment_service()
        result = assessment_service.submit_answer(
            assessment,
            question_id,
            answer_index,
            time_taken
        )
        
        # Update session
        session['current_assessment'] = assessment
        session['question_start_time'] = None
        
        logger.info(f'Answer processed - Correct: {result.get("is_correct")}')
        
        # Check if assessment is complete
        max_questions = current_app.config.get('MAX_QUESTIONS_PER_ASSESSMENT', 10)
        if assessment['current_question'] >= max_questions:
            logger.info('Assessment complete, redirecting to results')
            return redirect(url_for('assessment.results'))
        
        # Show feedback then continue
        return render_template(
            'assessment/feedback.html',
            result=result,
            assessment=assessment
        )
    
    except Exception as e:
        logger.exception(f'Error handling answer submission: {str(e)}')
        return render_template('errors/500.html'), 500

@assessment_bp.route('/results')
def results():
    """Display assessment results"""
    logger.info('Results page accessed')
    
    # Check if assessment exists
    if 'current_assessment' not in session:
        logger.warning('No assessment found, redirecting to start')
        return redirect(url_for('assessment.start'))
    
    try:
        assessment = session['current_assessment']
        assessment_service = get_assessment_service()
        
        # Calculate results
        logger.info(f'Calculating results for assessment {assessment["id"]}')
        results_data = assessment_service.calculate_results(assessment)
        
        # Get performance level
        performance_level = assessment_service.get_performance_level(results_data['score'])
        results_data['performance_level'] = performance_level
        
        # Get recommendation
        recommendation = assessment_service.get_recommended_difficulty(
            results_data['score'],
            assessment['difficulty']
        )
        results_data['recommended_difficulty'] = recommendation
        
        logger.info(f'Results calculated - Score: {results_data["score"]}%, Level: {performance_level}')
        
        # Generate AI feedback
        logger.info('Generating AI feedback')
        gemini_service = get_gemini_service()
        feedback = gemini_service.generate_feedback(results_data)
        
        if feedback:
            results_data['ai_feedback'] = feedback
            logger.info('AI feedback generated successfully')
        else:
            logger.warning('Failed to generate AI feedback')
            results_data['ai_feedback'] = None
        
        # Update user stats
        update_user_stats(results_data)
        
        return render_template(
            'assessment/results.html',
            results=results_data,
            assessment=assessment
        )
    
    except Exception as e:
        logger.exception(f'Error displaying results: {str(e)}')
        return render_template('errors/500.html'), 500

def update_user_stats(results_data):
    """Update user statistics in session"""
    logger.debug('Updating user stats')
    
    try:
        user_stats = session.get('user_stats', {
            'total_assessments': 0,
            'total_score': 0,
            'avg_score': 0,
            'badges': [],
            'history': []
        })
        
        # Update stats
        user_stats['total_assessments'] += 1
        user_stats['total_score'] += results_data['score']
        user_stats['avg_score'] = round(
            user_stats['total_score'] / user_stats['total_assessments'],
            2
        )
        
        # Add to history
        user_stats['history'].append({
            'date': results_data['completion_date'],
            'domain': results_data['domain'],
            'score': results_data['score'],
            'performance_level': results_data['performance_level']
        })
        
        # Award badges
        if results_data['score'] >= 90 and 'expert' not in user_stats['badges']:
            user_stats['badges'].append('expert')
            logger.info('Expert badge awarded')
        
        if user_stats['total_assessments'] == 1:
            user_stats['badges'].append('first_assessment')
            logger.info('First assessment badge awarded')
        
        # Update session
        session['user_stats'] = user_stats
        
        logger.debug(f'User stats updated: {user_stats}')
    
    except Exception as e:
        logger.exception(f'Error updating user stats: {str(e)}')
