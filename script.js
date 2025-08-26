// Quiz data
const quizData = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: 1
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correct: 3
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correct: 2
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["Ag", "Au", "Fe", "Cu"],
        correct: 1
    },
    {
        question: "Which year did World War II end?",
        options: ["1943", "1944", "1945", "1946"],
        correct: 2
    },
    {
        question: "What is the largest mammal in the world?",
        options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        correct: 1
    },
    {
        question: "Which programming language is known as the 'language of the web'?",
        options: ["Python", "Java", "JavaScript", "C++"],
        correct: 2
    },
    {
        question: "What is the square root of 144?",
        options: ["10", "11", "12", "13"],
        correct: 2
    },
    {
        question: "Which country is home to the kangaroo?",
        options: ["New Zealand", "South Africa", "Australia", "India"],
        correct: 2
    }
];

// Quiz state
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;
let timer = null;
let timeLeft = 15;
let shuffledQuestions = [];
let isQuizActive = false;

// DOM elements
const startScreen = document.getElementById('startScreen');
const quizScreen = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const nextBtn = document.getElementById('nextBtn');
const progressFill = document.getElementById('progressFill');
const currentQuestionSpan = document.getElementById('currentQuestion');
const totalQuestionsSpan = document.getElementById('totalQuestions');
const timerElement = document.getElementById('timer');
const finalScoreElement = document.getElementById('finalScore');
const highScoreElement = document.getElementById('highScore');

// Initialize the app
function init() {
    // Add start-screen class to body initially
    document.body.classList.add('start-screen');
    
    // Show start screen
    showStartScreen();
}

// Start quiz function
function startQuiz() {
    // Add loading state to start button
    const startBtn = document.querySelector('.btn-primary');
    const originalText = startBtn.textContent;
    startBtn.textContent = 'Starting...';
    startBtn.disabled = true;
    
    // Simulate loading time
    setTimeout(() => {
        // Remove start-screen class from body
        document.body.classList.remove('start-screen');
        
        // Hide start screen and show quiz screen
        startScreen.style.display = 'none';
        quizScreen.style.display = 'block';
        
        // Reset quiz state
        currentQuestionIndex = 0;
        score = 0;
        isQuizActive = true;
        
        // Shuffle only the questions, keep options in original order
        shuffledQuestions = [...quizData].sort(() => Math.random() - 0.5);
        
        // Load first question
        loadQuestion();
        
        // Reset start button
        startBtn.textContent = originalText;
        startBtn.disabled = false;
    }, 1000);
}

// Load question with simple approach
function loadQuestion() {
    const question = shuffledQuestions[currentQuestionIndex];
    
    questionElement.textContent = question.question;
    
    // Update progress
    const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;
    progressFill.style.width = progress + '%';
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
    totalQuestionsSpan.textContent = shuffledQuestions.length;

    // Clear previous options
    optionsElement.innerHTML = '';
    selectedAnswer = null;
    nextBtn.disabled = true;

    // Create option buttons
    question.options.forEach((option, index) => {
        const optionBtn = document.createElement('div');
        optionBtn.className = 'option';
        optionBtn.textContent = option;
        optionBtn.onclick = () => selectAnswer(index);
        optionsElement.appendChild(optionBtn);
    });
}

// Select answer with simple feedback
function selectAnswer(index) {
    if (selectedAnswer !== null) return; // Prevent multiple selections

    selectedAnswer = index;
    const options = document.querySelectorAll('.option');
    
    options.forEach((option, i) => {
        option.classList.remove('selected');
        if (i === index) {
            option.classList.add('selected');
        }
    });

    nextBtn.disabled = false;
}

// Next question with simple feedback
function nextQuestion() {
    if (selectedAnswer === null) return;

    // Disable next button to prevent multiple clicks
    nextBtn.disabled = true;

    // Check answer
    const question = shuffledQuestions[currentQuestionIndex];
    const options = document.querySelectorAll('.option');
    
    // Find the correct answer index in shuffled options
    const correctAnswer = question.options[question.correct];
    const correctIndex = question.options.findIndex(option => option === correctAnswer);

    // Show correct/incorrect feedback
    options.forEach((option, index) => {
        if (index === correctIndex) {
            option.classList.add('correct');
        } else if (index === selectedAnswer && selectedAnswer !== correctIndex) {
            option.classList.add('incorrect');
        }
    });

    // Update score
    if (selectedAnswer === correctIndex) {
        score++;
    }

    // Wait a moment to show correct/incorrect answers
    setTimeout(() => {
        currentQuestionIndex++;
        
        if (currentQuestionIndex < shuffledQuestions.length) {
            loadQuestion();
            resetTimer();
        } else {
            endQuiz();
        }
    }, 1500);
}

// End quiz early function
function endQuizEarly() {
    console.log('endQuizEarly function called'); // Debug log
    
    if (!isQuizActive) {
        console.log('Quiz is not active'); // Debug log
        return;
    }
    
    // Show confirmation dialog
    const confirmed = confirm('Are you sure you want to end the quiz? Your current progress will be saved.');
    
    if (confirmed) {
        console.log('User confirmed ending quiz'); // Debug log
        
        isQuizActive = false;
        clearInterval(timer);
        
        // Calculate score based on completed questions
        const completedQuestions = currentQuestionIndex + 1;
        const totalQuestions = shuffledQuestions.length;
        
        console.log(`Completed questions: ${completedQuestions}, Score: ${score}`); // Debug log
        
        // Simple transition to results
        quizScreen.style.display = 'none';
        resultScreen.style.display = 'block';
        resultScreen.classList.add('show');
        
        // Display results with early termination message
        const percentage = Math.round((score / completedQuestions) * 100);
        finalScoreElement.textContent = `${score}/${completedQuestions} (${percentage}%) - Quiz ended early`;
        
        // Check for high score (only if they completed at least 3 questions)
        if (completedQuestions >= 3) {
            const currentHighScore = localStorage.getItem('quizHighScore') || 0;
            if (score > currentHighScore) {
                localStorage.setItem('quizHighScore', score);
                highScoreElement.textContent = `🎉 New High Score! Previous: ${currentHighScore}`;
            } else {
                highScoreElement.textContent = `High Score: ${currentHighScore}/${totalQuestions}`;
            }
        } else {
            highScoreElement.textContent = 'Complete at least 3 questions to save a high score';
        }
    } else {
        console.log('User cancelled ending quiz'); // Debug log
    }
}

// Timer functions with simple visual feedback
function startTimer() {
    timeLeft = 15;
    updateTimerDisplay();
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 5) {
            timerElement.classList.add('warning');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            if (selectedAnswer === null) {
                // Auto-select first option if no answer selected
                selectAnswer(0);
            }
            nextQuestion();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    timerElement.classList.remove('warning');
    startTimer();
}

function updateTimerDisplay() {
    timerElement.textContent = timeLeft;
    
    // Simple color transition based on time left
    if (timeLeft <= 5) {
        timerElement.style.color = '#e74c3c';
    } else if (timeLeft <= 10) {
        timerElement.style.color = '#f39c12';
    } else {
        timerElement.style.color = '#667eea';
    }
}

// End quiz with simple transition
function endQuiz() {
    isQuizActive = false;
    clearInterval(timer);
    
    // Simple transition to results
    quizScreen.style.display = 'none';
    resultScreen.style.display = 'block';
    resultScreen.classList.add('show');
    
    // Display results - count current question as completed
    const completedQuestions = currentQuestionIndex + 1;
    const percentage = Math.round((score / completedQuestions) * 100);
    finalScoreElement.textContent = `${score}/${completedQuestions} (${percentage}%)`;

    // Check for high score
    const currentHighScore = localStorage.getItem('quizHighScore') || 0;
    if (score > currentHighScore) {
        localStorage.setItem('quizHighScore', score);
        highScoreElement.textContent = `🎉 New High Score! Previous: ${currentHighScore}`;
    } else {
        highScoreElement.textContent = `High Score: ${currentHighScore}/${completedQuestions}`;
    }
}

// Restart quiz with simple transition
function restartQuiz() {
    resultScreen.classList.remove('show');
    resultScreen.style.display = 'none';
    startQuiz();
}

// Show start screen function
function showStartScreen() {
    // Add start-screen class to body
    document.body.classList.add('start-screen');
    
    // Hide all screens and show start screen
    quizScreen.style.display = 'none';
    resultScreen.style.display = 'none';
    startScreen.style.display = 'block';
    
    // Reset quiz state
    currentQuestionIndex = 0;
    score = 0;
    isQuizActive = false;
    selectedAnswer = null;
    
    // Clear timer
    clearInterval(timer);
    resetTimer();
    
    // Reset progress bar
    progressFill.style.width = '0%';
    progressText.textContent = '';
    
    // Reset buttons
    nextBtn.disabled = true;
    nextBtn.textContent = 'Next';
}

// Utility function to shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Simple keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!isQuizActive) return;
    
    if (e.key >= '1' && e.key <= '4') {
        const optionIndex = parseInt(e.key) - 1;
        const options = document.querySelectorAll('.option');
        if (optionIndex < options.length) {
            selectAnswer(optionIndex);
        }
    } else if (e.key === 'Enter' && !nextBtn.disabled) {
        nextQuestion();
    } else if (e.key === 'Escape') {
        // Allow ending quiz with Escape key
        endQuizEarly();
    }
});

// Add event listener for end quiz button as backup
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the app
    init();
    
    const endQuizBtn = document.getElementById('endQuizBtn');
    if (endQuizBtn) {
        endQuizBtn.addEventListener('click', endQuizEarly);
    }
});
