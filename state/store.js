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

function dispatchStateChange() {
    store.dispatchEvent(new CustomEvent("state-changed", { detail: gameState }));
}

export function getState() {
  return gameState;
}

export function updateScore(points) {
  gameState.score += points;
  dispatchStateChange();
}

export function removeLife() {
  gameState.lives--;
  dispatchStateChange();
}

export function setMode(mode) {
  gameState.mode = mode;
  dispatchStateChange();
}

export function setAnswerIndex(index) {
  gameState.answerIndex = index;
  dispatchStateChange();
}

export function addRound() {
  gameState.rounds++;
  dispatchStateChange();
}

export function addSeenArtist(artistId) {
  gameState.seenArtists.add(artistId);
  dispatchStateChange();
}

export function resetGame() {
  gameState.score = 0;
  gameState.lives = 3;
  gameState.rounds = 0;
  gameState.seenArtists.clear();
  dispatchStateChange();
}

export function setCategory(category) {
  gameState.category = category;
  dispatchStateChange();
}

export function setSpotifyToken(token) {
  gameState.spotifyToken = token;
  dispatchStateChange();
}

export function setCurrentRoundArtists(artists) {
  gameState.currentRoundArtists = artists;
  dispatchStateChange();
}

export function incrementLikedSongsOffset() {
  gameState.likedSongsOffset += 50;
  dispatchStateChange();
}