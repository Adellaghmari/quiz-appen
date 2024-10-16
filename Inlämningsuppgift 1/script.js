let currentQuiz, currentQuestionIndex, score, timer, startTime;
const timeLimit = 30;

// Frågorna för FC Barcelona och Olympiska Spelen
let questions = {
    barcelona: [
        { question: "Vem har gjort mest mål i Barcelona historiskt sett?", choices: ["Puyol", "Suarez", "Messi", "Neymar"], answer: 2 },
        { question: "Vem har fått flest röda kort i Barcelona historiskt sett?", choices: ["Stoichkov", "Guardiola", "Thiago Motta", "Gerard Piqué"], answer: 0 },
        { question: "Vem har gjort flest assist i Barcelona historiskt sett?", choices: ["Messi", "Iniesta", "Xavi", "Dani Alves"], answer: 0 },
        { question: "Vem har vunnit flest troféer i Barcelona historiskt sett?", choices: ["Busquets", "Iniesta", "Gerard Piqué", "Messi"], answer: 3 },
        { question: "Vem har vunnit flest troféer som tränare i Barcelona?", choices: ["Guardiola", "Johan Cruyff", "Luis Enrique", "Frank Rijkaard"], answer: 0 }
    ],
    os: [
        { question: "Vilket år hölls de första moderna Olympiska spelen?", choices: ["1892", "1896", "1900", "1920"], answer: 1 },
        { question: "Vilken stad har arrangerat sommar-OS flest gånger?", choices: ["London", "Tokyo", "Paris", "Aten"], answer: 0 },
        { question: "Vilket land har vunnit flest medaljer i vinter-OS?", choices: ["Norge", "USA", "Kanada", "Ryssland"], answer: 0 },
        { question: "Vilken sport debuterade i OS under 2021?", choices: ["Skateboarding", "Rugby", "Golf", "Cricket"], answer: 0 },
        { question: "Vilket år hölls de första vinter-OS?", choices: ["1924", "1932", "1940", "1956"], answer: 0 }
    ]
};

// Funktion för att slumpa om varje fråga när någon går in i quizet
function shuffleQuestions(questions) {
    const shuffled = questions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
}

// Startar quizet med specifika frågor och slumpad ordning
function startQuiz(topic) {
    document.querySelector('.hero').classList.add('hidden');
    document.querySelector('.facts').classList.add('hidden');
    document.querySelector('.creator').classList.add('hidden');
    document.getElementById('quiz-container').classList.remove('hidden');

    document.getElementById('quiz-title').textContent = topic === 'barcelona' ? 'FC Barcelona Quiz' : 'Olympiska Spelen Quiz';

    // Slumpa frågor och tilldela till currentQuiz
    currentQuiz = shuffleQuestions(questions[topic]);
    currentQuestionIndex = 0;
    score = 0;
    startTime = Date.now();

    loadQuestion();
}

// Laddar frågan och inaktiverar knapparna efter första klick
function loadQuestion() {
    if (currentQuestionIndex >= currentQuiz.length) {
        endQuiz();
        return;
    }

    const questionData = currentQuiz[currentQuestionIndex];
    document.getElementById('question').textContent = questionData.question;

    const choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = '';

    questionData.choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.textContent = `${String.fromCharCode(65 + index)}) ${choice}`;
        
        button.onclick = () => {
            clearInterval(timer);
            disableChoices();
            showFeedback(index === questionData.answer);
        };
        
        choicesContainer.appendChild(button);
    });

    document.getElementById('time-left').textContent = timeLimit;
    clearInterval(timer);
    startTimer();
}

// Inaktiverar alla valknappar
function disableChoices() {
    const buttons = document.querySelectorAll('#choices button');
    buttons.forEach(button => {
        button.disabled = true;
    });
}

// Startar frågetimern
function startTimer() {
    let timeLeft = timeLimit;
    document.getElementById('time-left').textContent = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time-left').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            nextQuestion();
        }
    }, 1000);
}

// Visar feedback och går vidare till nästa fråga efter kort paus
function showFeedback(isCorrect) {
    const feedback = document.createElement('p');
    feedback.textContent = isCorrect ? 'Rätt!' : 'Fel!';
    feedback.style.color = isCorrect ? 'green' : 'red';
    document.getElementById('quiz-content').appendChild(feedback);
    if (isCorrect) score++;

    setTimeout(() => {
        feedback.remove();
        nextQuestion();
    }, 1000);
}

// Går vidare till nästa fråga
function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

// Avslutar quiz och visar resultat
function endQuiz() {
    clearInterval(timer);
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('result-container').classList.remove('hidden');
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
    document.getElementById('score').textContent = `Du fick ${score} av ${currentQuiz.length} rätt på ${totalTime} sekunder!`;

    const highScore = localStorage.getItem('highScore');
    if (!highScore || score > highScore) {
        localStorage.setItem('highScore', score);
        alert(`Nytt rekord! Din nya högsta poäng: ${score}`);
    }
}

// Återställer quizet till startsidan
function restartQuiz() {
    document.getElementById('result-container').classList.add('hidden');
    document.querySelector('.hero').classList.remove('hidden');
    document.querySelector('.facts').classList.remove('hidden');
    document.querySelector('.creator').classList.remove('hidden');
}
