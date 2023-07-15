
const questionElement = document.getElementById('question');
const answerButtons = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
var progressBarContainer = document.getElementById("progress-bar-container");
var progressBarElement = document.getElementById("progress-bar");
var timerElement = document.getElementById("timer");
const titleBarElement = document.querySelector('.title-bar')
const titleElement = document.querySelector('.appQuiz h1')
const imgElement = document.querySelector('.img')
const homeImgPath = 'assets/quiz show.svg'
const timeOutImgPath = 'assets/time-out.svg'
const goodResultImgPath = 'assets/Studet Good.svg'
const failResultImgPath = 'assets/Studet Fail.svg'



let questions = []
let curruntQuestionIndex = 0;
let score = 0;
let questionNums = []
let numberOfQuestion = 5;
let minutes = 5;
var remainingTime = minutes * 60 * 1000;
var remainingTimeOut = 10 * 1000;
var timerInterval;
var timerIntervalOut;


async function fetchData() {
    questions = await fetch('question.json');
    questions = await questions.json()
    // console.log(questions);
    homePage();
}

function startQuiz() {
    curruntQuestionIndex = 0;
    score = 0;
    questionNums = [];
    nextButton.innerHTML = "Next";
    progressBarContainer.style.display = "flex";
    progressBarElement.style.width = '0%'
    minutes = (minutes / 10 >= 1) ? minutes : `0${minutes}`
    timerElement.innerHTML = `${minutes}:00`;
    answerButtons.classList.remove('levels');
    titleBarElement.classList.remove('custom-border');
    titleElement.classList.add('custom-border');
    imgElement.classList.remove('w-100');
    imgElement.src ='';
    timer();
    showQuestion();
}

function selectQuestion() {
    let num = Math.floor(Math.random() * questions.length);
    while (questionNums.includes(num)) {
        num = Math.floor(Math.random() * questions.length);
    }
    questionNums.push(num);
    return num;
}

function showQuestion() {
    resetState();
    let curruntQuestion = questions[selectQuestion()];
    let questionNo = curruntQuestionIndex + 1;
    questionElement.innerHTML = `${questionNo}. ${curruntQuestion.question}`;

    let questionsLetters = ["A", "B", "C", "D"];
    questionsLetters.forEach((asnswer) => {
        const button = document.createElement('button');
        button.innerHTML = curruntQuestion[asnswer];
        button.classList.add('btn-ans');
        answerButtons.appendChild(button);
        if (curruntQuestion.answer === asnswer) {
            button.dataset.correct = "true";
        }
        button.addEventListener('click', selectAnswer);
    });
}

function resetState() {
    nextButton.style.display = 'none';
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    if (selectedBtn.dataset.correct === "true") {
        selectedBtn.classList.add('correct');
        score++;
    }
    else {
        selectedBtn.classList.add('incorrect');
    }
    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset?.correct === "true") {
            button.classList.add('correct');
        }
        button.disabled = true;
    })
    progressBarElement.style.width = `${Math.ceil(((curruntQuestionIndex + 1) / numberOfQuestion) * 100)}%`
    nextButton.style.display = "block"
}

function showScore() {
    resetState();
    progressBarContainer.style.display = "none";
    clearInterval(timerInterval);
    timerElement.innerHTML = "";
    titleBarElement.classList.add('custom-border');
    titleElement.classList.remove('custom-border');
    imgElement.src = (score >= numberOfQuestion/2)? goodResultImgPath : failResultImgPath;
    questionElement.innerHTML = `You scored ${score} out of ${numberOfQuestion}!`;
    questionElement.classList.add('justify-content-center');
    nextButton.innerHTML = 'Play Again';
    nextButton.style.display = 'block';
}

function handleNextButton() {
    curruntQuestionIndex++;
    if (curruntQuestionIndex < numberOfQuestion) {
        showQuestion();
    }
    else {
        showScore();
    }
}

function timer() {
    remainingTime = minutes * 60 * 1000;
    timerInterval = setInterval(() => {
        remainingTime -= 1000;

        // Calculate the hours, minutes, and seconds
        var minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        seconds = (seconds / 10 >= 1) ? seconds : `0${seconds}`
        minutes = (minutes / 10 >= 1) ? minutes : `0${minutes}`

        var timerString = minutes + ":" + seconds;
        timerElement.innerHTML = timerString;

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            showScore();
            nextButton.style.display = 'none';
            questionElement.innerHTML = '';
            timerElement.innerHTML = "Timer expired!";
            imgElement.src = timeOutImgPath;
            timeOut();
        }
    }, 1000);
}

function timeOut() {
    remainingTimeOut = 3 * 1000;
    timerIntervalOut = setInterval(() => {
        remainingTimeOut -= 1000;

        if (remainingTimeOut <= 0) {
            clearInterval(timerIntervalOut);
            nextButton.style.display = 'block';
            questionElement.innerHTML = `You scored ${score} out of ${numberOfQuestion}!`;
            timerElement.innerHTML = "";
            imgElement.src ='';
        }
    }, 1000);
}

nextButton.addEventListener('click', () => {
    if (curruntQuestionIndex < numberOfQuestion && remainingTime > 0) {
        handleNextButton();
    }
    else {
        homePage();
    }
});

function homePage() {
    resetState();
    imgElement.src = homeImgPath;
    questionElement.innerHTML = '';
    questionElement.classList.remove('justify-content-center');
    imgElement.classList.add('w-100');
    answerButtons.classList.add('levels');
    const levelsButtons = `<button class="btn-level fw-semibold">Easy</button>
                            <button class="btn-level fw-semibold">Medium</button>
                            <button class="btn-level fw-semibold">Hard</button>`;
    answerButtons.innerHTML = levelsButtons;
    progressBarContainer.style.display = "none";
    const btnLevel = document.querySelectorAll('.btn-level');
    btnLevel.forEach((button) => button.addEventListener('click', chooseLevel));
}

function chooseLevel(e) {
    const selectedBtn = e.target;
    if (selectedBtn.innerHTML == "Easy") {
        numberOfQuestion = 6
        minutes = 10
    }
    else if (selectedBtn.innerHTML == "Medium") {
        numberOfQuestion = 12
        minutes = 12
    }
    else {
        numberOfQuestion = 18
        minutes = 16
    }
    startQuiz();
}


fetchData();

