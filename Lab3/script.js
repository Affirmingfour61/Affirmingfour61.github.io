const q4Options = ["20", "1", "5", "10000"];
const shuffledOptions = q4Options.sort(() => Math.random() - 0.5);

const q4Select = document.getElementById('q4select');
q4Select.innerHTML = ''; 

shuffledOptions.forEach(opt => {
  const option = document.createElement('option');
  option.value = opt;
  option.text = opt;
  q4Select.add(option);
});

let attempts = parseInt(localStorage.getItem('quizAttempts')) || 0;
document.getElementById('timesTaken').innerText = attempts;

function submitQuiz() {
  let score = 0;

  const q1Answer = document.querySelector('input[name="q1"]:checked');
  if (q1Answer && q1Answer.value === "JavaScript") {
    score += 20;
    showFeedback(1, true);
  } else {
    showFeedback(1, false);
  }

  const q2Answers = Array.from(document.querySelectorAll('input[name="q2"]:checked')).map(cb => cb.value);
  if (q2Answers.includes("CSS") && q2Answers.includes("Javascript") && !q2Answers.includes("Code")) {
    score += 20;
    showFeedback(2, true);
  } else {
    showFeedback(2, false);
  }

  const q3Answer = document.getElementById('q3input').value.trim().toLowerCase();
  if (q3Answer === "C") {
    score += 20;
    showFeedback(3, true);
  } else {
    showFeedback(3, false);
  }

  const q4Select = document.getElementById('q4select');
  if (q4Select.value === "5") {
    score += 20;
    showFeedback(4, true);
  } else {
    showFeedback(4, false);
  }

  const q5Answer = document.querySelector('input[name="q5"]:checked');
  if (q5Answer && q5Answer.value === "//") {
    score += 20;
    showFeedback(5, true);
  } else {
    showFeedback(5, false);
  }

  let attempts = parseInt(localStorage.getItem('quizAttempts')) || 0;
  attempts++;
  localStorage.setItem('quizAttempts', attempts);
  document.getElementById('timesTaken').innerText = attempts;

  document.getElementById('totalScore').innerText = `Total Score: ${score} / 100`;

const congratsMessage = document.getElementById('congratsMessage');
if (score >= 80) {
  congratsMessage.innerHTML = "Congratulations! You scored above 80%!";
  
  let img = document.getElementById('congratsImage');
  if (!img) {
    img = document.createElement('img');
    img.id = 'congratsImage';
    img.style.width = '200px';     
    img.style.display = 'block';
    img.style.marginTop = '10px';
    congratsMessage.appendChild(img);
  }
  img.src = "img.jpg"; 
} else {
  congratsMessage.innerHTML = "";
}
}

function showFeedback(qNum, correct) {
  const feedback = document.getElementById('feedback' + qNum);
  feedback.innerHTML = '';

  const img = document.createElement('img');
  img.src = correct ? 'https://img.icons8.com/emoji/48/000000/check-mark-emoji.png' : 'https://img.icons8.com/emoji/48/000000/cross-mark-emoji.png';
  img.alt = correct ? 'Correct' : 'Incorrect';

  feedback.appendChild(img);
  const text = document.createTextNode(correct ? 'Correct' : 'Incorrect');
  feedback.appendChild(text);
}


function showFeedback(qNum, correct) {
  const feedback = document.getElementById('feedback' + qNum);
  feedback.innerHTML = '';

  const img = document.createElement('img');
  img.src = correct ? 'https://img.icons8.com/emoji/48/000000/check-mark-emoji.png' : 'https://img.icons8.com/emoji/48/000000/cross-mark-emoji.png';
  img.alt = correct ? 'Correct' : 'Incorrect';

  feedback.appendChild(img);
  const text = document.createTextNode(correct ? 'Correct' : 'Incorrect');
  feedback.appendChild(text);
}
