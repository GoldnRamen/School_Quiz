const registrationForm = document.getElementById("registrationForm");
const deadline = new Date("October 1, 2024");
const currentDate = new Date();
const deadlineNotice = document.getElementById("deadlineNotice");
const lateFeeNotice = document.getElementById("lateFeeNotice");
const schoolData = JSON.parse(localStorage.getItem("schoolData")) || [];
const previousWinners = JSON.parse(localStorage.getItem("winners")) || [];

if (currentDate > deadline) {
    deadlineNotice.innerText = "The registration deadline has passed.";
    lateFeeNotice.classList.remove("hidden");
} else {
    deadlineNotice.innerText = `Registration is open until ${deadline.toDateString()}.`;
}

registrationForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const schoolName = document.getElementById("schoolName").value;
    const candidateName = document.getElementById("candidateName").value;

    if (!schoolName || !candidateName) {
        alert("Please fill out all fields.");
        return;
    }
    else{
        schoolData.push({ school: schoolName, candidate: candidateName });
        localStorage.setItem("schoolData", JSON.stringify(schoolData));
        alert("Registration successful!");
        if (currentDate > deadline) {
            alert("Late registration fee of NGN5,000 is required.");
        }
        else{
            document.getElementById("quiz").classList.remove("hidden")
            document.getElementById("regNleader").classList.add("hidden")
            startQuiz();
            document.getElementById("currentSchool").textContent = `${schoolName}`
            document.getElementById("currentCandid").textContent = `${candidateName}`
            document.getElementById("ElapsedTime").innerText = `${minutes}:${formattedSeconds}`
        }
    }  
    
});

const winnerBtn = document.getElementById("winnerBtn");
const winnerList = document.getElementById("winnerList");

winnerBtn.addEventListener("click", () => {
    document.getElementById("winners").classList.toggle("hidden");
});

previousWinners.forEach(winner => {
    const li = document.createElement("li");
    li.innerText = `${winner.school}, ${winner.candidate}`;
    winnerList.appendChild(li);
});

const quizData = [
    { question: "What is the capital of Nigeria?", options: ["Lagos", "Abuja", "Kano", "Ibadan"], answer: "Abuja" },
    { question: "Who is the current president of Nigeria?", options: ["Goodluck Jonathan", "Bola Tinubu", "Muhammadu Buhari", "Olusegun Obasanjo"], answer: "Bola Tinubu" },
    { question: "Which planet is referred to as 'The Red Planet'?", options: ["Earth", "Venus", "Mars", "Jupiter"], answer: "Mars" },
    { question: "What is the method by which a caterpillar becomes a butterfly?", options: ["Osmosis", "Photosynthesis", "Meiosis", "Metamorphosis"], answer: "Metamorphosis" },
    { question: "What is the largest river in Africa?", options: ["Nile", "Zambezi", "Styx", "Niger"], answer: "Nile" },
    { question: "Which ocean is the largest in the world?", options: ["Pacific", "Arctic", "Atlantic", "Indian"], answer: "Pacific" },
    { question: "Who developed the theory of Evolution?", options: ["Charles Dawkins", "Issac Newton", "Charles Darwin", "Al Capone"], answer: "Charles Darwin" },
    { question: "What is the process by which plants use sunlight and carbon dioxide?", options: ["Photogenesis", "Photosynergy", "Photosynthesis", "Photocology"], answer: "Photosynthesis" },
    { question: "Which is the largest hot desert in the world?", options: ["Gobi", "Nevada", "Sahara", "Antarctica"], answer: "Sahara" },
    { question: "How many bones are there in the adult human body?", options: ["300", "211", "306", "206"], answer: "206" }
];

let currentQuestionIndex = 0;
let correctAnswers = 0;
const questionContainer = document.getElementById("questionContainer");
const quizSection = document.getElementById("quiz");
const timerElement = document.getElementById("timer");

function shuffleQuestions() {
    quizData.sort(() => 0.5 - Math.random());
}

function showQuestion() {
    if (currentQuestionIndex < quizData.length) {
        const currentQuestion = quizData[currentQuestionIndex];
        const optionsHtml = currentQuestion.options.map((option, index) => `
            <div>
                <input type="radio" id="option${index}" name="quizOption" value="${option}">
                <label for="option${index}">${option}</label>
            </div>
        `).join('');

        questionContainer.innerHTML = `
            <p>${currentQuestion.question}</p>
            ${optionsHtml}
            <button id="submitAnswer" class="mt-3 justify-end hover:bg-green-600 hover:text-white border border-black border-3 hover:border-white rounded-md p-2">Submit</button>
        `;

        document.getElementById("submitAnswer").addEventListener("click", handleAnswerSubmission);
    } else {
        endQuiz();
    }
}

function handleAnswerSubmission() {
    const selectedOption = document.querySelector("input[name='quizOption']:checked");

    if (selectedOption) {
        const selectedAnswer = selectedOption.value;
        if (selectedAnswer === quizData[currentQuestionIndex].answer) {
            correctAnswers++;
        }
        currentQuestionIndex++;
        showQuestion();
    } else {
        alert("Please select an answer before submitting.");
    }
}

let timer
function startTimer() {
    let timeLeft = 120;
    const timer = setInterval(function() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
        
        document.getElementById("ElapsedTime").innerText = `${minutes}:${formattedSeconds}`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            endQuiz();
        } else {
            timeLeft--;
        }
    }, 1000);
}

let timeLeft = 200;
    

function startQuiz() {
    shuffleQuestions();
    quizSection.classList.remove("hidden");
    showQuestion();
    startTimer();
}

function endQuiz() {
    const percentage = (correctAnswers / quizData.length) * 100;
    showResults(percentage);
    localStorage.setItem("winners", JSON.stringify([
        ...previousWinners,
        { school: schoolData[schoolData.length - 1].school, candidate: schoolData[schoolData.length - 1].candidate, score: percentage }
    ]));
}

const resultModal = document.getElementById("resultModal");
const resultsList = document.getElementById("resultsList");
const closeModal = document.getElementById("closeModal");
const myModal = document.getElementById("myModal")
function showResults(percentage) {
    resultModal.classList.remove("hidden");

    const latestSchool = schoolData[schoolData.length - 1].school;
    const latestCandidate = schoolData[schoolData.length - 1].candidate;
    const newWinner = { school: latestSchool, candidate: latestCandidate, score: percentage };

    let winners = JSON.parse(localStorage.getItem("winners")) || [];

    winners.push(newWinner);

    localStorage.setItem("winners", JSON.stringify(winners));

    myModal.innerHTML = `<li>${newWinner.candidate}, from ${newWinner.school} scored ${newWinner.score}%</li>`;
    document.getElementById("congratulationsMessage").innerText = "Congratulations to the winners!";

    updateWinnerList();
}

function updateWinnerList() {
    const winnerList = document.getElementById("winnerList");

    winnerList.innerHTML = "";

    const winners = JSON.parse(localStorage.getItem("winners")) || [];

    winners.forEach(winner => {
        const li = document.createElement("li");
        li.innerHTML = `<p class="border-black border-b p-2">${winner.candidate}, from ${winner.school} scored ${winner.score}%</p>`;
        winnerList.appendChild(li);
    });
}

function showHighestScorer() {
    const winners = JSON.parse(localStorage.getItem("winners")) || [];

    if (winners.length === 0) {
        document.getElementById("highestScorer").innerText = "No winners available yet.";
        return;
    }
    let topScorer = winners.reduce((highest, current) => {
        return (current.score > highest.score) ? current : highest;
    }, winners[0]);
    
    document.getElementById("highestScorer").innerText = 
        `${topScorer.candidate} from ${topScorer.school} with a score of ${topScorer.score}%`;
}

document.addEventListener("DOMContentLoaded", function() {
    updateWinnerList();
    showHighestScorer()
});

closeModal.addEventListener("click", function() {
    resultModal.classList.add("hidden");
    clearInterval(timer)
    document.getElementById("regNleader").classList.remove("hidden")
    document.getElementById("quiz").classList.add("hidden")
    document.getElementById("schoolName").value = " ";
    document.getElementById("candidateName").value = " "
    updateWinnerList()
    showHighestScorer()
});
