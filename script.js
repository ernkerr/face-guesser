import { handleClickGuess, handleExpertGuess } from "./utils/guessHandler.js";

import { roundGenerator } from "./utils/roundGenerator.js";
import { initAnimations, playAnimation } from "./animations.js";
import {
  showGameScreen,
  showGameOverScreen,
  showTitleScreen,
} from "./ui/screens.js";
import {
  gameState,
  updateScore,
  removeLife,
  resetGame,
  setMode,
  setAnswerIndex,
  addRound,
} from "./utils/gameState.js";
import {
  updateScoreDisplay,
  updateQuestion,
  removeHeart,
} from "../ui/updater.js";

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
const gridItems = document.querySelectorAll(".grid-item");
const nextBtn = document.getElementById("next");

// =========================================
// EVENT LISTENERS
// =========================================

startBtn.addEventListener("click", () => {
  setTimeout(() => {
    showGameScreen();
    setAnswerIndex(roundGenerator(filteredOptions, gameState.mode, gridItems)); // start first round
  }, 500); // match the CSS transition time
});

// =========================================
// MODE
// =========================================

const modes = ["easy", "normal", "expert"];
modeBtn.textContent = `Mode: ${gameState.mode}`; // initialize mode text
modeBtn.addEventListener("click", switchMode);

// hide input + next button by default
const expertModeContainer = document.getElementById("expert-mode");
expertModeContainer.style.display = "none";

function switchMode() {
  const currentIndex = modes.indexOf(gameState.mode); // get the current mode's index
  const nextIndex = (currentIndex + 1) % modes.length; // get next index (wraps back to 0)
  gameState.mode = modes[nextIndex]; // update mode
  modeBtn.textContent = `Mode: ${gameState.mode}`; // update button text

  // if in expert mode, show the expert mode container
  expertModeContainer.style.display =
    gameState.mode !== "expert" ? "none" : "block";
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
  if (guessIndex === gameState.answerIndex) {
    updateScore(10); // updates gameState
    updateScoreDisplay(gameState.score); // updates UI
    playAnimation("correct");
    disableGuesses();
    setTimeout(handleNext, 1000);
  } else {
    playAnimation("incorrect");
    removeLife();
    removeHeart(gameState.lives);
    disableGuesses();
    setTimeout(handleNext, 1000);
  }

  if (gameState.lives === 0) {
    console.log("Game Over");
    handleGameOver();
  }
}

// different logic in expert mode

function checkExpertGuess() {
  const guessElement = document.getElementById("guess-input");
  const guess = guessElement.value.trim().toUpperCase();
  const answer = filteredOptions[gameState.answerIndex].name
    .trim()
    .toUpperCase();

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
    updateScoreDisplay(gameState.score); // updates UI
  } else {
    console.log("❌ Incorrect. Guess:", guess, "Answer:", answer);
    playAnimation("incorrect");
    removeLife();
    removeHeart(gameState.lives);
  }

  if (gameState.lives === 0) {
    console.log("Game Over");
    handleGameOver();
  }

  // reset input for the next round
  guessElement.value = "";
  // alt if fuzzy search doesn't work very well
  // Levenshtein Distance Algorithm
  // Jaro-Winkler Distance
  // Soundex and Metaphone Algorithms
}

// ======= NEXT ROUND =======

function handleNext() {
  console.log("Next Clicked");
  // handle guess for expert mode
  if (gameState.mode === "expert") {
    checkExpertGuess();
  }
  gameState.answerIndex = roundGenerator(
    filteredOptions,
    gameState.mode,
    gridItems
  );
}

nextBtn.addEventListener("click", handleNext);

// ======= GAME OVER SCREEN =======

function handleGameOver() {
  showGameOverScreen();

  // show score in center
  // TODO: if highscore, ask for name
  // try again

  let tryAgainButton = document.getElementById("try-again");
  tryAgainButton.addEventListener("click", handleReset);
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
