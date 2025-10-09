export const gameState = {
  score: 0,
  lives: 3,
  rounds: 0,
  mode: "normal",
  category: "DJ",
  answerIndex: null,
};

export function updateScore(points) {
  gameState.score += points;
  return gameState.score;
}

export function removeLife() {
  gameState.lives -= 1;
  return gameState.lives;
}

export function resetGame() {
  gameState.score = 0;
  gameState.lives = 3;
  gameState.rounds = 0;
  gameState.answerIndex = null;
}

export function setMode(newMode) {
  gameState.mode = newMode;
}

export function setAnswerIndex(index) {
  gameState.answerIndex = index;
}

export function addRound() {
  gameState.rounds += 1;
}
