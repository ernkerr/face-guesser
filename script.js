import Fuse from "https://cdn.jsdelivr.net/npm/fuse.js@6.6.2/dist/fuse.esm.js";

import { roundGenerator } from "./utils/roundGenerator.js";
import { initAnimations, playAnimation } from "./animations.js";
import {
  showGameScreen,
  showGameOverScreen,
  showTitleScreen,
} from "./ui/screens.js";

await initAnimations(); // preload JSONs

// MVP:
// make database for people with name + image
const options = [
  { name: "Martin Garrix", source: "images/martin_garrix.png", category: "dj" },
  { name: "David Guetta", source: "images/david_guetta.png", category: "dj" },
  { name: "Alok", source: "images/alok.png", category: "dj" },
  { name: "Fred Again...", source: "images/fred_again.png", category: "dj" },
  { name: "Timmy Trumpet", source: "images/timmy_trumpet.png", category: "dj" },
];

const startBtn = document.getElementById("start-btn");
let modeBtn = document.getElementById("mode-btn");
const scoreDisplay = document.getElementById("score");
const gridItems = document.querySelectorAll(".grid-item");
const nextBtn = document.getElementById("next");
let score = 0;
let lives = 3;
let rounds = 0;
let answerIndex;

// =========================================
// EVENT LISTENERS
// =========================================

startBtn.addEventListener("click", () => {
  setTimeout(() => {
    showGameScreen();

    // titleScreen.style.display = "none"; // hide title screen
    // gameScreen.style.display = "block"; // show game screen
    // gameScreen.style.opacity = 1;
    answerIndex = roundGenerator(filteredOptions, mode, gridItems); // start first round
  }, 500); // match the CSS transition time
});

// =========================================
// MODE
// =========================================

const modes = ["easy", "normal", "expert"];
let mode = "normal";
modeBtn.textContent = `Mode: ${mode}`; // initialize mode text
modeBtn.addEventListener("click", switchMode);

// hide input + next button by default
const expertModeContainer = document.getElementById("expert-mode");
expertModeContainer.style.display = "none";

function switchMode() {
  const currentIndex = modes.indexOf(mode); // get the current mode's index
  const nextIndex = (currentIndex + 1) % modes.length; // get next index (wraps back to 0)
  mode = modes[nextIndex]; // update mode
  modeBtn.textContent = `Mode: ${mode}`; // update button text

  // if in expert mode, show the expert mode container
  expertModeContainer.style.display = mode !== "expert" ? "none" : "block";
}

// ======= CATEGORY =======
// let categoryTitle = category.toUpperCase();
// document.getElementById("category").textContent = `${categoryTitle}`;
// P2: let user select a category (must be logged in error toast)
// if they are logged in then they can switch the category like they can switch the mode
// get that user's category: artist, rapper,  country singer, etc.

let category = "dj";
let filteredOptions = options.filter((option) => option.category === category); // filter for the selected category

// ======= GUESS HANDLER =======

function checkGuess(guessIndex) {
  if (guessIndex === answerIndex) {
    playAnimation("correct");
    disableGuesses();
    console.log("Correct!");
    updateScore(10);

    setTimeout(handleNext, 1000);
  } else {
    playAnimation("incorrect");
    removeLife();
    disableGuesses();
    setTimeout(handleNext, 1000);
  }
}

// different logic in expert mode

function checkExpertGuess() {
  const guessElement = document.getElementById("guess-input");
  const guess = guessElement.value.trim().toUpperCase();
  const answer = filteredOptions[answerIndex].name.trim().toUpperCase();

  // calculate a “fuzzy match score”
  const fuse = new Fuse([{ name: answer }], {
    keys: ["name"], // what property to search in
    threshold: 0.4, // lower = stricter match, higher = fuzzier
    ignoreLocation: true, // ignore position of match
    minMatchCharLength: 1,
    includeScore: true,
  });
  // runs the search will return a number from 0 - 1
  const results = fuse.search(guess);
  console.log("Results", results);

  // Default fuzzyScore = 0 if no match
  let fuzzyScore = 0;
  if (results.length > 0 && typeof results[0].score === "number") {
    fuzzyScore = 1 - results[0].score;
    console.log("Fuzzy Score:", fuzzyScore.toFixed(2));
  }

  const threshold = 0.7;
  const minLengthRatio = 0.7; // must match at least 50% of the correct name length

  if (
    fuzzyScore >= threshold &&
    guess.length / answer.length >= minLengthRatio
  ) {
    console.log("✅ Correct! Guess:", guess, "Answer:", answer);
    playAnimation("correct");
    updateScore(10);
  } else {
    console.log("❌ Incorrect. Guess:", guess, "Answer:", answer);
    playAnimation("incorrect");
    removeLife();
  }

  // reset input for the next round
  guessElement.value = "";
  // alt if fuzzy search doesn't work very well
  // Levenshtein Distance Algorithm
  // Jaro-Winkler Distance
  // Soundex and Metaphone Algorithms
}

// ======= SCORE HANDLER =======

function updateScore(points) {
  score += points;

  // animation
  scoreDisplay.classList.remove("gelatine"); // reset
  void scoreDisplay.offsetWidth; // force reflow (hack so browser sees the removal)
  scoreDisplay.classList.add("gelatine"); // re-add so animation runs again

  scoreDisplay.textContent = score;
}

// ======= NEXT ROUND =======

function handleNext() {
  console.log("Next Clicked");
  // handle guess for expert mode
  if (mode === "expert") {
    checkExpertGuess();
  }
  rounds += 1;
  answerIndex = roundGenerator(filteredOptions, mode, gridItems);
}

nextBtn.addEventListener("click", handleNext);

// ======= LIFE HANDLER =======
function removeLife() {
  console.log("-1 life");
  lives -= 1;
  const hearts = document.querySelectorAll(".heart");

  // remove a heart
  // If there’s a heart to remove, remove the last one visually
  if (hearts[lives]) {
    hearts[lives].style.opacity = "0.2"; // faded look
    setTimeout(() => hearts[lives].remove(), 1000);
    // OR you can completely remove it:
    // hearts[lives].remove();
  }

  if (lives === 0) {
    console.log("Game Over");
    handleGameOver();
  }
}

// ======= GAME OVER SCREEN =======

function handleGameOver() {
  showGameOverScreen();

  // show score in center
  // TODO: if highscore, ask for name
  // try again

  let tryAgainButton = document.getElementById("try-again");
  tryAgainButton.addEventListener("click", handleReset);
}

function handleReset() {
  console.log("resetting game");
  lives = 3;
  score = 0;
  showGameScreen();
  answerIndex = roundGenerator(filteredOptions, mode, gridItems);
}

// ======= CLICK CONTROL =======
function disableGuesses() {
  gridItems.forEach((gridItem) => {
    const img = gridItem.querySelector("img");
    img.style.pointerEvents = "none"; // block clicks
  });
}

// ======= INITIALIZATION =======

gridItems.forEach((gridItem) => {
  gridItem.addEventListener("click", (event) => {
    // figure out what was clicked (img or p)
    const target = event.target;
    const guessIndex = parseInt(target.dataset.index);

    // only continue if it was a valid clickable element (has data-index)
    if (!isNaN(guessIndex)) {
      // bounce animation on the WHOLE grid item
      gridItem.classList.remove("gelatine"); // reset
      void gridItem.offsetWidth; // force reflow
      gridItem.classList.add("gelatine"); // re-add

      // run your guess check logic
      checkGuess(guessIndex);
    }
  });
});

// ======= P2 =======
// Allow people to login with spotify
// categories (user's genres)

// “Who’s this?” style AR/Instagram/TikTok effect, where a DJ or celebrity’s image hovers over someone’s forehead while they record themselves reacting
// Webcam video feed – get live camera input from the user.
// Face detection / tracking – figure out where the forehead is so you can place the image correctly.
// Overlay image – show the DJ/celebrity image “on top” of the person’s forehead.
// Optional: record the video and allow sharing to social media.
