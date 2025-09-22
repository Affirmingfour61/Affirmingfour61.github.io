let randomNumber;
let attempts = 0;
let maxAttempts = 7;
let wins = 0;
let losses = 0;

initializeGame();

document.querySelector("#guessBtn").addEventListener("click", checkGuess);
document.querySelector("#resetBtn").addEventListener("click", initializeGame);

function initializeGame() {
    randomNumber = Math.floor(Math.random() * 99) + 1;
    console.log("Random number: " + randomNumber);
    attempts = 0;

    document.querySelector("#guessBtn").style.display = "inline";
    document.querySelector("#resetBtn").style.display = "none";

    let playerGuess = document.querySelector("#playerGuess");
    playerGuess.disabled = false;
    playerGuess.value = '';
    playerGuess.focus();

    document.querySelector("#feedback").textContent = '';
    document.querySelector("#guesses").textContent = '';
    document.querySelector("#attemptsLeft").textContent = `Attempts left: ${maxAttempts}`;
    document.querySelector("#winLoss").textContent = `Wins: ${wins} | Losses: ${losses}`;
}

function checkGuess() {
    let playerGuess = document.querySelector("#playerGuess");
    let feedback = document.querySelector("#feedback");
    let guess = parseInt(playerGuess.value);

    if (isNaN(guess) || guess < 1 || guess > 99) {
        alert("Invalid input! Enter a number between 1 and 99.");
        playerGuess.value = '';
        return;
    }

    attempts++;
    document.querySelector("#attemptsLeft").textContent = `Attempts left: ${maxAttempts - attempts}`;
    document.querySelector("#guesses").textContent += guess + " ";
    feedback.style.color = "orange";

    if (guess === randomNumber) {
        feedback.textContent = "You guessed it! You Won!";
        feedback.style.color = "darkgreen";
        wins++;
        endGame();
    } else if (attempts === maxAttempts) {
        feedback.textContent = `You lost! The number was ${randomNumber}`;
        feedback.style.color = "red";
        losses++;
        endGame();
    } else {
        feedback.textContent = guess > randomNumber ? " Guess was high" : "Guess was low";
    }

    document.querySelector("#winLoss").textContent = `Wins: ${wins} | Losses: ${losses}`;
}

function endGame() {
    document.querySelector("#guessBtn").style.display = "none";
    document.querySelector("#resetBtn").style.display = "inline";
    document.querySelector("#playerGuess").disabled = true;
}
