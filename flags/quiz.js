let quizData = [];
let currentQuestion = 0;
let score = 0;

const flagImg = document.getElementById('flag-img');
const optionsList = document.getElementById('options');
const showAnswerBtn = document.getElementById('show-answer-btn');
const nextBtn = document.getElementById('next-btn');
const resultDiv = document.getElementById('result');
const scoreText = document.getElementById('score');

function loadQuestion() {
    const currentQuiz = quizData[currentQuestion];
    flagImg.src = currentQuiz.img;
    optionsList.innerHTML = '';

    currentQuiz.options.forEach((option, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<button class="btn btn-outline-primary btn-answer">${option}</button>`;
        li.addEventListener('click', () => selectAnswer(option));
        optionsList.appendChild(li);
    });

    showAnswerBtn.style.display = 'inline-block';
    nextBtn.style.display = 'none';
}

function selectAnswer(selectedOption) {
    const currentQuiz = quizData[currentQuestion];
    const allButtons = document.querySelectorAll('.btn-answer');

    allButtons.forEach(button => {
        button.disabled = true;
        if (button.textContent === currentQuiz.country_name) {
            button.classList.remove('btn-outline-primary');
            button.classList.add('btn-success');
        }
        if (button.textContent === selectedOption && selectedOption !== currentQuiz.country_name) {
            button.classList.remove('btn-outline-primary');
            button.classList.add('btn-danger');
        }
    });

    if (selectedOption === currentQuiz.country_name) {
        score++;
    }

    showAnswerBtn.style.display = 'none';
    nextBtn.style.display = 'inline-block';
}

showAnswerBtn.addEventListener('click', () => {
    selectAnswer('');
});

nextBtn.addEventListener('click', () => {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        displayResult();
    }
});

function displayResult() {
    document.getElementById('quiz').style.display = 'none';
    resultDiv.style.display = 'block';
    scoreText.textContent = `You scored ${score} out of ${quizData.length}`;
}

function loadQuizData() {
    fetch('flags.json')
        .then(response => response.json())
        .then(data => {
            quizData = data;
            quizData.sort(() => Math.random() - 0.5); // Shuffle questions
            loadQuestion(); // Start the quiz
        })
        .catch(error => console.error('Error loading quiz data:', error));
}

// Load the quiz data from the JSON file
loadQuizData();
