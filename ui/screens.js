// manages showing/hiding different screens

export const titleScreen = document.getElementById("title-screen");
export const gameScreen = document.getElementById("game-screen");
export const gameOverScreen = document.getElementById("game-over-screen");

// Hide game and gameOver by default
gameScreen.style.display = "none";
gameOverScreen.style.display = "none";

/**
 * Shows the title screen and hides others
 */
export function showTitleScreen() {
  titleScreen.style.display = "block";
  gameScreen.style.display = "none";
  gameOverScreen.style.display = "none";
}

/**
 * Shows the main game screen
 */
export function showGameScreen() {
  titleScreen.style.display = "none";
  gameScreen.style.display = "block";
  gameOverScreen.style.display = "none";
}

/**
 * Shows the game over screen
 */
export function showGameOverScreen() {
  titleScreen.style.display = "none";
  gameScreen.style.display = "none";
  gameOverScreen.style.display = "block";
}
