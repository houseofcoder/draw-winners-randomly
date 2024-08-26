let quizData = [];
let usedQuestions = new Set();
let timerInterval;

// Load JSON data from the file
fetch('https://luckydraw.lol/assets/data/pokemon_data.json')
    .then(response => response.json())
    .then(data => {
        quizData = data;
        loadRandomQuestion();
    })
    .catch(error => console.error('Error loading JSON:', error));

function loadRandomQuestion() {
    clearInterval(timerInterval);
    document.getElementById('next-btn').style.display = 'none'; // Hide Next button initially
    document.getElementById('show-answer-btn').style.display = 'inline-block'; // Show Show Answer button initially

    // Ensure the next question is random and not reused
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * quizData.length);
    } while (usedQuestions.has(randomIndex) && usedQuestions.size < quizData.length);

    usedQuestions.add(randomIndex);

    const currentQuestion = quizData[randomIndex];
    document.getElementById('pokemon-img').src = currentQuestion.img;
    document.getElementById('options-container').innerHTML = '';

    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-primary', 'option-btn');
        button.innerText = option;
        button.addEventListener('click', () => handleAnswer(option, currentQuestion.pokemon_name));
        document.getElementById('options-container').appendChild(button);
    });

    document.getElementById('timer').innerText = '10';
    startTimer(currentQuestion.pokemon_name);
}

function startTimer(correctAnswer) {
    let timeLeft = 10;
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if (timeLeft === 0) {
            clearInterval(timerInterval);
            highlightCorrectAnswer(correctAnswer);
            document.getElementById('next-btn').style.display = 'inline-block'; // Show Next button after time is up
            document.getElementById('show-answer-btn').style.display = 'none'; // Hide Show Answer button
        }
    }, 1000);
}

function handleAnswer(selectedOption, correctAnswer) {
    clearInterval(timerInterval);
    highlightCorrectAnswer(correctAnswer, selectedOption);
    document.getElementById('next-btn').style.display = 'inline-block'; // Show Next button after an answer is selected
    document.getElementById('show-answer-btn').style.display = 'none'; // Hide Show Answer button
}

function highlightCorrectAnswer(correctAnswer, selectedOption = null) {
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(button => {
        if (button.innerText === correctAnswer) {
            button.classList.add('correct');
        } else if (selectedOption && button.innerText === selectedOption) {
            button.classList.add('incorrect');
        }
        button.disabled = true;
    });
}

// Next button functionality
document.getElementById('next-btn').addEventListener('click', () => {
    if (usedQuestions.size < quizData.length) {
        loadRandomQuestion();
    } else {
        alert('Quiz Completed!');
        // Optionally, you can reset the quiz or show results here
        usedQuestions.clear(); // Reset the set of used questions for a new round
        loadRandomQuestion();
    }
});

document.getElementById('show-answer-btn').addEventListener('click', () => {
    clearInterval(timerInterval);
    highlightCorrectAnswer(quizData[Array.from(usedQuestions).pop()].pokemon_name);
    document.getElementById('next-btn').style.display = 'inline-block'; // Show Next button when the answer is shown
    document.getElementById('show-answer-btn').style.display = 'none'; // Hide Show Answer button
});
