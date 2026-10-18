
const guessForm = document.querySelector("#guess-form");
const guessInput = document.querySelector("#guess-input");
const guessButton = document.querySelector("#guess-button");
const newGameButton = document.querySelector("#new-game");
const scoreDisplay = document.querySelector("#score");
const attemptsDisplay = document.querySelector("#attempts");
const bestScoreDisplay = document.querySelector("#best-score");
const numberDisplay = document.querySelector("#number-display");
const feedback = document.querySelector("#feedback");
const guessHistory = document.querySelector("#guess-history");

const MAX_ATTEMPTS = 7;

let secretNumber;
let attemptsLeft;
let score;
let gameOver;
let guesses;

let bestScore = Number(localStorage.getItem("numberHuntBest")) || 0;

function startGame() {
  secretNumber = Math.floor(Math.random() * 100) + 1;
  attemptsLeft = MAX_ATTEMPTS;
  score = 0;
  gameOver = false;
  guesses = [];

  scoreDisplay.textContent = score;
  attemptsDisplay.textContent = attemptsLeft;
  bestScoreDisplay.textContent = bestScore;
  numberDisplay.textContent = "?";

  feedback.textContent = "Enter your first guess to get started.";
  feedback.className = "feedback";

  guessHistory.innerHTML =
    '<span class="empty-history">Your attempts will appear here</span>';

  guessInput.value = "";
  guessInput.disabled = false;
  guessButton.disabled = false;
  guessInput.focus();
}

function showFeedback(message, type = "") {
  feedback.textContent = message;
  feedback.className = type ? `feedback ${type}` : "feedback";
}

function addGuessToHistory(guess, type) {
  if (guesses.length === 1) {
    guessHistory.innerHTML = "";
  }

  const chip = document.createElement("span");
  chip.className = `guess-chip ${type}`;
  chip.textContent = guess;
  guessHistory.appendChild(chip);
}

function finishGame(won) {
  gameOver = true;
  guessInput.disabled = true;
  guessButton.disabled = true;
  numberDisplay.textContent = secretNumber;

  if (won) {
    score = attemptsLeft * 10;
    scoreDisplay.textContent = score;

    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem("numberHuntBest", bestScore);
      bestScoreDisplay.textContent = bestScore;

      showFeedback(
        `Amazing! You found the number and set a new record: ${score} points!`,
        "success"
      );
    } else {
      showFeedback(
        `You got it! The secret number was ${secretNumber}. You earned ${score} points!`,
        "success"
      );
    }
  } else {
    showFeedback(
      `Game over! The secret number was ${secretNumber}. Try again!`,
      "error"
    );
  }
}

guessForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (gameOver) return;

  const guess = Number(guessInput.value);

  if (!Number.isInteger(guess) || guess < 1 || guess > 100) {
    showFeedback("Please enter a whole number between 1 and 100.", "error");
    return;
  }

  if (guesses.includes(guess)) {
    showFeedback("You already tried that number. Choose another!", "error");
    return;
  }

  guesses.push(guess);
  attemptsLeft--;

  attemptsDisplay.textContent = attemptsLeft;

  if (guess === secretNumber) {
    addGuessToHistory(guess, "correct");
    finishGame(true);
    return;
  }

  const type = guess > secretNumber ? "high" : "low";

  addGuessToHistory(guess, type);

  if (attemptsLeft === 0) {
    finishGame(false);
    return;
  }

  if (guess > secretNumber) {
    showFeedback(
      `Too high! Try a smaller number. ${attemptsLeft} attempts left.`
    );
  } else {
    showFeedback(
      `Too low! Try a bigger number. ${attemptsLeft} attempts left.`
    );
  }

  guessInput.value = "";
  guessInput.focus();
});

newGameButton.addEventListener("click", startGame);

startGame();
