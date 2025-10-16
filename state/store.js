const gameState = {
  score: 0,
  lives: 3,
  mode: "easy",
  category: "DJ",
  answerIndex: null,
  rounds: 0,
  seenArtists: new Set(),
  currentRoundArtists: [],
  spotifyToken: null,
  likedSongsOffset: 0,
};

export const store = new EventTarget();

export function getState() {
  return gameState;
}

export function updateScore(points) {
  gameState.score += points;
  store.dispatchEvent(new CustomEvent("state-changed", { detail: { score: gameState.score } }));
}

export function removeLife() {
  gameState.lives--;
  store.dispatchEvent(new CustomEvent("state-changed", { detail: { lives: gameState.lives } }));
}

export function setMode(mode) {
  gameState.mode = mode;
  store.dispatchEvent(new CustomEvent("state-changed", { detail: { mode: gameState.mode } }));
}

export function setAnswerIndex(index) {
  gameState.answerIndex = index;
  store.dispatchEvent(new CustomEvent("state-changed", { detail: { answerIndex: gameState.answerIndex } }));
}

export function addRound() {
  gameState.rounds++;
  store.dispatchEvent(new CustomEvent("state-changed", { detail: { rounds: gameState.rounds } }));
}

export function addSeenArtist(artistId) {
  gameState.seenArtists.add(artistId);
  store.dispatchEvent(new CustomEvent("state-changed", { detail: { seenArtists: gameState.seenArtists } }));
}

export function resetGame() {
  gameState.score = 0;
  gameState.lives = 3;
  gameState.rounds = 0;
  gameState.seenArtists.clear();
  store.dispatchEvent(new CustomEvent("state-changed", { detail: { score: gameState.score, lives: gameState.lives, rounds: gameState.rounds, seenArtists: gameState.seenArtists } }));
}

export function setCategory(category) {
  gameState.category = category;
  store.dispatchEvent(new CustomEvent("state-changed", { detail: { category: gameState.category } }));
}

export function setSpotifyToken(token) {
  gameState.spotifyToken = token;
  store.dispatchEvent(new CustomEvent("state-changed", { detail: { spotifyToken: gameState.spotifyToken } }));
}

export function setCurrentRoundArtists(artists) {
  gameState.currentRoundArtists = artists;
  store.dispatchEvent(new CustomEvent("state-changed", { detail: { currentRoundArtists: gameState.currentRoundArtists } }));
}

export function incrementLikedSongsOffset() {
  gameState.likedSongsOffset += 50;
  store.dispatchEvent(new CustomEvent("state-changed", { detail: { likedSongsOffset: gameState.likedSongsOffset } }));
}