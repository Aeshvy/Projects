document.addEventListener("DOMContentLoaded", function () {
  let gameActive = false; // Variable to track if the game is active

  const holes = document.querySelectorAll(".hole");
  const moles = document.querySelectorAll(".mole");
  let lastHole;
  let timeUp = false;
  let score = 0;
  let highScore = localStorage.getItem("highScore") || 0;
  const resetButton = document.getElementById("resetButton");

  function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  function randomHole(holes) {
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];
    if (hole === lastHole) {
      return randomHole(holes);
    }
    lastHole = hole;
    return hole;
  }

  function bonk() {
    if (!timeUp) {
      this.style.display = "none";
      this.parentElement.classList.remove("up");
      score++;
      updateScores();
    }
  }

  function peep() {
    const time = randomTime(1000, 2000);
    const hole = randomHole(holes);
    hole.classList.add("up");
    const mole = hole.querySelector(".mole");
    mole.style.display = "block";
    setTimeout(() => {
      hole.classList.remove("up");
      mole.style.display = "none";
      if (!timeUp) peep();
    }, time);
  }

  function startGame() {
    if (!gameActive) {
      gameActive = true; // Set the game as active
      timeUp = false;
      score = 0;
      peep();
      setTimeout(() => {
        timeUp = true;
        if (score === 10) {
          const restart = confirm("You Win! Restart game?");
          if (restart) {
            resetGame(); // Restart the game
          }
        } else {
          const restart = confirm("Game over. Try again. Restart game?");
          if (restart) {
            resetGame(); // Restart the game
          }
        }

        // Update high score if needed
        if (score > highScore) {
          highScore = score;
          localStorage.setItem("highScore", highScore);
        }

        gameActive = false; // Set the game as not active
      }, 10000); // Game lasts for 10 seconds
    }
  }

  moles.forEach((mole) => mole.addEventListener("click", bonk));

  function updateScores() {
    document.getElementById(
      "currentScore"
    ).innerText = `Current Score: ${score}`;
    document.getElementById("highScore").innerText = `High Score: ${highScore}`;
  }

  updateScores();

  function resetGame() {
    timeUp = true; // Set timeUp to true to stop the game

    // Reset the game state and UI
    moles.forEach((mole) => (mole.style.display = "none"));
    holes.forEach((hole) => hole.classList.remove("up"));

    // Enable the reset button
    resetButton.removeAttribute("disabled");
  }

  resetButton.addEventListener("click", startGame); // Change to startGame

  initGame(); // Call the function to initialize the game
});
