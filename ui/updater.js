// manages updating UI content (score, question, images, etc.)
const spotifyBtn = document.getElementById("spotify-btn");
const userBtn = document.getElementById("user-btn");
const logoutBtn = document.getElementById("logout-btn");
const userImg = document.getElementById("user-img");
const userName = document.getElementById("user-name");

export const scoreDisplay = document.getElementById("score");
export const questionText = document.querySelector(".question-text");
export const questionImg = document.getElementById("question-img");
const heartsContainer = document.getElementById("hearts");

/**
 * Helper Functions
 */

function triggerAnimation(element, className) {
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
}

/**
 * Updates the score on screen
 */
export function updateScoreDisplay(score) {
  triggerAnimation(scoreDisplay, "gelatine");
  scoreDisplay.textContent = score;
}

/**
 * Updates the question text/image based on mode
 */
export function updateQuestion(answer, mode) {
  if (mode === "easy") {
    questionText.textContent = `Who is ${answer.name}?`;
    questionImg.style.display = "none";
  } else {
    questionText.textContent = `Who is this?`;
    questionImg.src = answer.source;
    questionImg.style.display = "block";
  }
}

// P2: updateQuestionAR()

/**
 * Updates the hearts (lives) display on screen
 */
export function removeHeart(lives) {
  const hearts = document.querySelectorAll(".heart");

  // If there’s a heart to remove, remove the last one visually
  if (hearts[lives]) {
    hearts[lives].remove();
  }
}

// Update UI when logged in
export function updateUser(url, name) {
  userImg.src = url;
  userName.textContent = name;

  spotifyBtn.classList.add("hidden"); // hide login button
  userBtn.classList.remove("hidden"); // show user button
  logoutBtn.classList.add("hidden"); // hide logout initially
}
/**
 * Resets the Spotify button to the default login state
 */
// Update UI when logged out
export function updateLogout() {
  spotifyBtn.classList.remove("hidden"); // show login button
  userBtn.classList.add("hidden"); // hide user button
  logoutBtn.classList.add("hidden"); // hide logout button
}
// Toggle logout button when user button is clicked
userBtn.addEventListener("click", () => {
  logoutBtn.classList.toggle("hidden");
});
